var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var merge = require('lodash.merge');
var replace = require('broccoli-replace');
var chalk = require('chalk');
var VersionChecker = require('ember-cli-version-checker');
var TemplateCompiler = require('./lib/template-compiler');
var hash = require('object-hash');

module.exports = {
  name: 'ember-cli-conditional-compile',
  enableCompile: false,

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    var checker = new VersionChecker(this);
    checker.forEmber().assertAbove('2.9.0');

    this.htmlbarsVersion = checker.for('ember-cli-htmlbars', 'npm');
    this.uglifyVersion = checker.for('ember-cli-uglify', 'npm');
  },

  included: function(parent) {
    // https://ember-cli.com/api/classes/Addon.html#method_included
    var app = parent.app || parent;
    var config = this.project.config(app.env);

    var options = {
      options: {
        compress: {
          global_defs: config.featureFlags
        }
      }
    };

    if (this.uglifyVersion.satisfies('>= 2.0.0')) {
      app.options = merge(app.options, { 'ember-cli-uglify': { uglify: options.options } });
      this.enableCompile = app.options['ember-cli-uglify'].enabled;
    } else {
      app.options.minifyJS = merge(app.options.minifyJS, options);
      this.enableCompile = app.options.minifyJS.enabled;
    }

    var templateCompilerInstance = {
      name: 'conditional-compile-template',
      plugin: TemplateCompiler(config.featureFlags)
    }

    if (this.htmlbarsVersion.satisfies('>= 1.3.0')) {
      templateCompilerInstance['baseDir'] = function() {
        return __dirname;
      };

      templateCompilerInstance['cacheKey'] = function() {
        return hash(config.featureFlags);
      };
    } else {
      console.log(chalk.yellow(
        'Upgrade to ember-cli-htmlbars >= 1.3.0 to get build caching'
      ));
    }

    parent.registry.add('htmlbars-ast-plugin', templateCompilerInstance);
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('js', {
      name: 'ember-cli-conditional-compile',
      ext: 'js',
      toTree: (tree) => this.transpileTree(tree)
    });
  },

  /**
   * Inline feature flags value so that babili's dead code elimintation plugin
   * removes the code non reachable.
   */
  transpileTree(tree, config) {
    var esTranspiler = require('broccoli-babel-transpiler');
    var inlineFeatureFlags = require('babel-plugin-inline-replace-variables');
    var config = this.project.config(EmberApp.env());
    if (!this.enableCompile) {
      return tree;
    }
    return esTranspiler(tree, {
      plugins: [
        [ inlineFeatureFlags, config.featureFlags ]
      ]
    });
  },


  postprocessTree: function(type, tree) {
    if (type !== 'js') return tree;

    var config = this.project.config(EmberApp.env());

    if (!config.featureFlags) {
      console.log(chalk.red(
        'Could not find any feature flags.' +
        'You may need to add them in your config/environment.js'
      ));
      return tree;
    }

    var excludes = [];

    Object.keys(config.featureFlags).map(function(flag) {
      if (config.includeDirByFlag && !config.featureFlags[flag] && config.includeDirByFlag[flag]) {
        excludes = excludes.concat(config.includeDirByFlag[flag]);
      }
    });

    if (this.enableCompile) {
      excludes = excludes.concat(
        /ember-cli-conditional-compile-features.js/
      );
    } else {
      tree = replace(tree, {
        files: [config.modulePrefix + '/initializers/ember-cli-conditional-compile-features.js'],
        patterns: [{
          match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
          replacement: JSON.stringify(config.featureFlags || {})
        }]
      });
    }

    return new Funnel(tree, {
      exclude: excludes,
      description: 'Funnel: Conditionally Filtered App'
    });
  }
};

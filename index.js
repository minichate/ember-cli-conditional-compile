let Funnel = require('broccoli-funnel');
let EmberApp = require('ember-cli/lib/broccoli/ember-app');
let merge = require('lodash.merge');
let replace = require('broccoli-replace');
let chalk = require('chalk');
let VersionChecker = require('ember-cli-version-checker');
let TemplateCompiler = require('./lib/template-compiler');
let hash = require('object-hash');
const fs = require('fs');
const path = require('path');
module.exports = {
  name: 'ember-cli-conditional-compile',
  enableCompile: false,

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    let checker = new VersionChecker(this);
    checker.forEmber().assertAbove('2.9.0');

    this.htmlbarsVersion = checker.for('ember-cli-htmlbars', 'npm');
    this.uglifyVersion = checker.for('ember-cli-uglify', 'npm');
    this.terserVersion = checker.for('ember-cli-terser', 'npm');
  },

  included: function(app, parentAddon) {
    let target = (parentAddon || app);
    this.readConfig()

    let options = {
      options: {
        compress: {
          global_defs: this.config.featureFlags
        }
      }
    };

    if (this.terserVersion.exists()) {
      target.options = merge(target.options, { 'ember-cli-terser': { terser: options.options } });
      this.enableCompile = target.options['ember-cli-terser'].enabled;
    } else if (this.uglifyVersion.satisfies('>= 2.0.0')) {
      target.options = merge(target.options, { 'ember-cli-uglify': { uglify: options.options } });
      this.enableCompile = target.options['ember-cli-uglify'].enabled;
    } else {
      target.options.minifyJS = merge(target.options.minifyJS, options);
      this.enableCompile = target.options.minifyJS.enabled;
    }

    let templateCompilerInstance = {
      name: 'conditional-compile-template',
      plugin: TemplateCompiler(this._config.featureFlags)
    }

    if (this.htmlbarsVersion.satisfies('>= 1.3.0')) {
      templateCompilerInstance['baseDir'] = function() {
        return __dirname;
      };

      const featureFlags = this._config.featureFlags

      templateCompilerInstance['cacheKey'] = function() {
        return hash(featureFlags);
      };
    } else {
      console.log(chalk.yellow(
        'Upgrade to ember-cli-htmlbars >= 1.3.0 to get build caching'
      ));
    }

    target.registry.add('htmlbars-ast-plugin', templateCompilerInstance);
  },

  readConfig() {
    const root = this.project.root;
    const config = this.project.config(EmberApp.env())
    const flagsEnv = config.featureFlagsEnvironment || EmberApp.env()

    let configFactory = path.join(root, 'config', 'feature-flags.js');

    if (fs.existsSync(configFactory)) {
      this._config = Object.assign({}, require(configFactory)(flagsEnv));
    } else {
      this._config = { featureFlags: {} };
    }
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
  transpileTree(tree) {
    const esTranspiler = require('broccoli-babel-transpiler');
    const inlineFeatureFlags = require('babel-plugin-inline-replace-variables');
    if (!this.enableCompile) {
      return tree;
    }
    return esTranspiler(tree, {
      plugins: [
        [inlineFeatureFlags, this._config.featureFlags]
      ]
    });
  },

  postprocessTree: function(type, tree) {
    if (type !== 'js') return tree;

    const config = this.project.config(EmberApp.env());

    if (!this._config.featureFlags) {
      console.log(chalk.red(
        'Could not find any feature flags.' +
        'You may need to add them in your config/environment.js'
      ));
      return tree;
    }

    let excludes = [];

    Object.keys(this._config.featureFlags).forEach(function(flag) {
      if (this._config.includeDirByFlag && !this._config.featureFlags[flag] && this._config.includeDirByFlag[flag]) {
        const flaggedExcludes = this._config.includeDirByFlag[flag].map(function(glob) {
          return config.modulePrefix + '/' + glob;
        })
        excludes = excludes.concat(flaggedExcludes);
      }
    }, this);

    if (this.enableCompile) {
      tree = replace(tree, {
        files: [config.modulePrefix + '/initializers/ember-cli-conditional-compile-features.js'],
        patterns: [
          {
            match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
            replacement: '{}'
          }
        ]
      })
    } else {
      tree = replace(tree, {
        files: [config.modulePrefix + '/initializers/ember-cli-conditional-compile-features.js'],
        patterns: [{
          match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
          replacement: JSON.stringify(this._config.featureFlags || {})
        }]
      });
    }

    return replace(tree, {
      files: excludes,
      patterns: [{
        match: /.*/g,
        replacement: '/**/'
      }]
    })
  }
};

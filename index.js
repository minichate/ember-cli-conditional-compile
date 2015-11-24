/* jshint node: true */

var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var merge = require('lodash-node/modern/objects/merge');
var replace = require('broccoli-replace');
var chalk = require('chalk');
var path = require('path');
var HtmlbarsCompiler = require('ember-cli-htmlbars');

module.exports = {
  name: 'ember-cli-conditional-compile',
  enableCompile: false,
  registry: null,

  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    var config = this.project.config(target.env);
    var templateCompiler = require(
      path.join(
        this.project.root,
        this.project.bowerDirectory,
        '/ember/ember-template-compiler'
      )
    );

    this.registry = target.registry;

    var options = {
      options: {
        compress: {
          global_defs: config.featureFlags
        }
      }
    };
    var astPlugins = this.astPlugins();

    target.options.minifyJS = merge(target.options.minifyJS, options);
    this.enableCompile = target.options.minifyJS.enabled;

    target.registry.remove('template', 'broccoli-ember-hbs-template-compiler');
    target.registry.remove('template', 'ember-cli-htmlbars');
    target.registry.add('template', {
      name: 'conditional-compile-template',
      toTree: function(tree) {
        Object.keys(config.featureFlags).map(function(flag) {
          var replaceRegex = new RegExp(
            '{{#if-flag-' + flag + '}}([\\s\\S]*?)(?:{{\/if-flag-' + flag + '}}|(?:{{else-flag-' + flag + '}}([\\s\\S]*?){{\/if-flag-' + flag + '}}))',
            'gmi'
          );
          var replacement = config.featureFlags[flag] ? "$1" : "$2";
          tree = replace(tree, {
            files: ['**/*'],
            patterns: [{
              match: replaceRegex,
              replacement: replacement
            }]
          });
        });
        return new HtmlbarsCompiler(tree, {
          isHTMLBars: true,
          templateCompiler: templateCompiler,
          plugins: {
            ast: astPlugins
          }
        });
      }
    }, ['hbs', 'handlebars']);
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
      if (!config.featureFlags[flag] && config.includeDirByFlag[flag]) {
        excludes = excludes.concat(config.includeDirByFlag[flag]);
      }
    });

    tree = replace(tree, {
      files: [config.modulePrefix + '/initializers/ember-cli-conditional-compile-features.js'],
      patterns: [{
        match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
        replacement: JSON.stringify(config.featureFlags || {})
      }]
    });

    if (this.enableCompile) {
      excludes = excludes.concat(
        /app\/initializers\/ember-cli-conditional-compile-features.js/
      );
    }

    return new Funnel(tree, {
      exclude: excludes,
      description: 'Funnel: Conditionally Filtered App'
    });
  },

  astPlugins: function() {
    var pluginWrappers = this.registry.load('htmlbars-ast-plugin');
    var plugins = pluginWrappers.map(function(wrapper) {
      return wrapper.plugin;
    });

    return plugins;
  }

};

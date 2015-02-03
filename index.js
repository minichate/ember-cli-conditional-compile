/* jshint node: true */

var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var merge = require('lodash-node/modern/objects/merge');
var replace = require('broccoli-replace');
var chalk = require('chalk');
var templateCompiler = require('broccoli-ember-hbs-template-compiler')

module.exports = {
  name: 'ember-cli-conditional-compile',
  enableCompile: false,

  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    var config = this.project.config(target.env);

    var options = {
      options: {
        compress: {
          global_defs: config.featureFlags
        }
      }
    };

    target.options.minifyJS = merge(target.options.minifyJS, options);
    this.enableCompile = target.options.minifyJS.enabled;

    if (!this.enableCompile) {
      return
    }

    target.registry.remove('template', 'broccoli-ember-hbs-template-compiler');
    target.registry.add('template', {
      name: 'conditional-compile-template',
      ext: 'hbs',
      toTree: function(tree) {
        Object.keys(config.featureFlags).map(function(flag) {
          if (!config.featureFlags[flag]) {
            var replaceRegex = new RegExp(
              '{{#if-flag-' + flag + '}}([\\s\\S]+?){{\\/if-flag-' + flag + '}}',
              'gmi'
            );
            tree = replace(tree, {
              files: ['**/*'],
              patterns: [{
                match: replaceRegex,
                replacement: ''
              }]
            });
          } else {
            var replaceRegex = new RegExp(
              '{{#if-flag-' + flag + '}}([\\s\\S]+?){{\\/if-flag-' + flag + '}}',
              'gmi'
            );
            tree = replace(tree, {
              files: ['**/*'],
              patterns: [{
                match: replaceRegex,
                replacement: "$1"
              }]
            });
          }
        });
        return templateCompiler(tree);
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
      files: ['app/initializers/ember-cli-conditional-compile-features.js', 'app/initializers/conditional-compile.js'],
      patterns: [{
        match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
        replacement: JSON.stringify(config.featureFlags || {})
      }]
    });

    if (this.enableCompile) {
      excludes = excludes.concat(
        /app\/initializers\/ember-cli-conditional-compile-features.js/
      );
      excludes = excludes.concat(
        /app\/initializers\/conditional-compile.js/
      );
    }

    return new Funnel(tree, {
      exclude: excludes,
      description: 'Funnel: Conditionally Filtered App'
    });
  }
};

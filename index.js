/* jshint node: true */

var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var merge = require('lodash-node/modern/objects/merge');
var replace = require('broccoli-replace');
var chalk = require('chalk');

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

    if (!this.enableCompile) {
      tree = replace(tree, {
        files: ['app/initializers/ember-cli-conditional-compile-features.js'],
        patterns: [{
          match: /EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS/g,
          replacement: JSON.stringify(config.featureFlags || {})
        }]
      });
    } else {
      excludes = excludes.concat(
        /app\/initializers\/ember-cli-conditional-compile-features.js/
      );
    }

    return new Funnel(tree, {
      exclude: excludes,
      description: 'Funnel: Conditionally Filtered App'
    });
  }
};

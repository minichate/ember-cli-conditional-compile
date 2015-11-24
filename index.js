/* jshint node: true */

var Funnel = require('broccoli-funnel');
var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var merge = require('lodash-node/modern/objects/merge');
var replace = require('broccoli-replace');
var chalk = require('chalk');
var TemplateCompiler = require('./lib/template-compiler');

module.exports = {
  name: 'ember-cli-conditional-compile',
  enableCompile: false,
  registry: null,

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

    var compiler = new TemplateCompiler(target.registry, this.project);

    target.registry.remove('template', 'broccoli-ember-hbs-template-compiler');
    target.registry.remove('template', 'ember-cli-htmlbars');
    target.registry.add(
      'template',
      compiler.plugin(config.featureFlags),
      ['hbs', 'handlebars']
    );
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

    if (this.enableCompile) {
      excludes = excludes.concat(
        /app\/initializers\/ember-cli-conditional-compile-features.js/
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

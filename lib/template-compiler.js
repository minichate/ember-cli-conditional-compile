var path = require('path');
var replace = require('broccoli-replace');
var HtmlbarsCompiler = require('ember-cli-htmlbars');

module.exports = function(registry, project) {
  this.registry = registry;
  this.project = project
};

module.exports.prototype.plugin = function(flags) {
  var templateCompiler = require(
    path.join(
      this.project.root,
      this.project.bowerDirectory,
      '/ember/ember-template-compiler'
    )
  );
  var astPlugins = this.astPlugins();

  return {
    name: 'conditional-compile-template',
    toTree: function(tree) {
      Object.keys(flags).map(function(flag) {
        var replaceRegex = new RegExp(
          '{{#if-flag-' + flag + '}}([\\s\\S]*?)(?:{{\/if-flag-' + flag + '}}|(?:{{else-flag-' + flag + '}}([\\s\\S]*?){{\/if-flag-' + flag + '}}))',
          'gmi'
        );
        var replacement = flags[flag] ? "$1" : "$2";
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
  };
};

module.exports.prototype.astPlugins = function() {
  var pluginWrappers = this.registry.load('htmlbars-ast-plugin');
  var plugins = pluginWrappers.map(function(wrapper) {
    return wrapper.plugin;
  });

  return plugins;
};

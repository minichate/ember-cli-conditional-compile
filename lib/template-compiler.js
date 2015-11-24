var path = require('path');
var replace = require('broccoli-replace');
var HtmlbarsCompiler = require('ember-cli-htmlbars');

module.exports = function(flags) {
  this.flags = flags;
}

module.exports.prototype.transform = function(ast) {
  var pluginContext = this;
  var b = this.syntax.builders;
  var walker = new this.syntax.Walker();

  walker.visit(ast, function(node) {
    if (!pluginContext.validate(node)) {
      return;
    }
        
    pluginContext.processParams(node);
  });

  return ast;
};

module.exports.prototype.processParams = function(node) {
  var _this = this;
  var b = this.syntax.builders;

  Object.keys(this.flags).forEach(function(flag) {
    if (node.path.original === 'if-flag-' + flag) {
      node.path = b.path('if');
      node.params = [b.boolean(_this.flags[flag])];
    }
  });
};

module.exports.prototype.validate = function(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
};

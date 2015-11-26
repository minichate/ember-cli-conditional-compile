var compileFlags = null;

function ConditionalTemplateCompiler() {
}

ConditionalTemplateCompiler.prototype.transform = function(ast) {
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

ConditionalTemplateCompiler.prototype.processParams = function(node) {
  var _this = this;
  var b = this.syntax.builders;

  Object.keys(compileFlags).forEach(function(flag) {
    if (node.path && node.path.original === 'if-flag-' + flag) {
      node.path = b.path('if');
      node.params = [b.boolean(compileFlags[flag])];
    }
  });
};

ConditionalTemplateCompiler.prototype.validate = function(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
};

module.exports = function(flags) {
  compileFlags = flags;
  return ConditionalTemplateCompiler;
};

var compileFlags = null;

function ConditionalTemplateCompiler() {
}

ConditionalTemplateCompiler.prototype.transform = function(ast) {
  var pluginContext = this;
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
  var b = this.syntax.builders;

  for (var flag in compileFlags) {
    if (node.path && node.path.original === 'if-flag-' + flag) {
      node.path = b.path('if');
      node.params = [b.boolean(compileFlags[flag])];

      if (compileFlags[flag] && node.inverse) {
        node.inverse = b.program(false, false, node.inverse.loc);
      } else if (!compileFlags[flag] && node.program) {
        node.program = b.program(false, false, node.program.loc);
      }

      break;
    }
  }
};

ConditionalTemplateCompiler.prototype.validate = function(node) {
  return node.type === 'BlockStatement' || node.type === 'MustacheStatement';
};

module.exports = function(flags) {
  compileFlags = flags;
  return ConditionalTemplateCompiler;
};

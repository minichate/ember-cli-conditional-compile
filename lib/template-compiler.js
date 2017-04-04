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

ConditionalTemplateCompiler.prototype.mungeNode = function(node, flag, unless) {
  var b = this.syntax.builders;

  if (!unless) {
    node.path = b.path('if');
  } else {
    node.path = b.path('unless');
  }

  node.params = [b.boolean(compileFlags[flag])];

  var flagEnabled = compileFlags[flag];

  if (unless) {
    flagEnabled = !flagEnabled;
  }

  if (flagEnabled && node.inverse) {
    node.inverse = b.program(false, false, node.inverse.loc);
  } else if (!flagEnabled && node.program) {
    node.program = b.program(false, false, node.program.loc);
  }
};

ConditionalTemplateCompiler.prototype.processParams = function(node) {
  for (var flag in compileFlags) {
    if (!node.path) {
      break;
    }

    if (node.path.original === 'if-flag-' + flag) {
      this.mungeNode(node, flag, false);
    }

    if (node.path.original === 'unless-flag-' + flag) {
      this.mungeNode(node, flag, true);
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

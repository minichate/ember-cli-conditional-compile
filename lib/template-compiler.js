let compileFlags = null;

function ConditionalTemplateCompiler() {
}

ConditionalTemplateCompiler.prototype.transform = function(ast) {
  let pluginContext = this;
  let walker = new this.syntax.Walker();

  walker.visit(ast, function(node) {
    if (!pluginContext.validate(node)) {
      return;
    }

    pluginContext.processParams(node);
  });

  return ast;
};

ConditionalTemplateCompiler.prototype.mungeNode = function(node, flag, unless) {
  let b = this.syntax.builders;

  if (!unless) {
    node.path = b.path('if');
  } else {
    node.path = b.path('unless');
  }

  let flagEnabled = compileFlags[flag];

  node.params = [b.boolean(flagEnabled)];

  if (unless) {
    flagEnabled = !flagEnabled;
  }

  if (flagEnabled && node.inverse) {
    node.inverse = b.program(false, false, node.inverse.loc);
  } else if (!flagEnabled && node.program) {
    node.program = b.program(false, false, node.program.loc);
  }
};

ConditionalTemplateCompiler.prototype.mungePlainHelperNode = function(node, unless) {
  let compileFlag = node.params[0]['original'];

  if (!(compileFlag in compileFlags)) {
    throw 'No compile flag found for ' + compileFlag;
  }

  this.mungeNode(node, compileFlag, unless);
};

ConditionalTemplateCompiler.prototype.processParams = function(node) {
  for (let flag in compileFlags) {
    if (node.path.original === 'if-flag-' + flag) {
      this.mungeNode(node, flag, false);
    }

    if (node.path.original === 'unless-flag-' + flag) {
      this.mungeNode(node, flag, true);
    }
  }

  if (node.path.original === 'if-flag') {
    this.mungePlainHelperNode(node, false);
  }

  if (node.path.original === 'unless-flag') {
    this.mungePlainHelperNode(node, true);
  }
};

ConditionalTemplateCompiler.prototype.validate = function(node) {
  let nodeType = (node.type === 'BlockStatement' || node.type === 'MustacheStatement');

  if (!nodeType) {
    return false;
  }

  return (
    node.path && (
      node.path.original.startsWith('if-flag') ||
      node.path.original.startsWith('unless-flag')
    )
  );
};

module.exports = function(flags) {
  compileFlags = flags;
  return ConditionalTemplateCompiler;
};

let compileFlags = null;
let tEnv = null

function transform(ast) {
  let walker = new tEnv.syntax.Walker();

  walker.visit(ast, function(node) {
    if (!validate(node)) {
      return;
    }

    processParams(node);
  });

//   return ast;
}


function ConditionalTemplateCompiler(env) {
  tEnv = env;
  return {
    name: 'condititional-compiler',
    visitor: {
      Program(ast) {
        return transform(ast);
      }
    }
  }
}

function mungeNode(node, flag, unless) {
  let b = tEnv.syntax.builders;

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
}

function mungePlainHelperNode(node, unless) {
  let compileFlag = node.params[0]['original'];

  if (!(compileFlag in compileFlags)) {
    throw 'No compile flag found for ' + compileFlag;
  }

  mungeNode(node, compileFlag, unless);
}

function processParams(node) {
  for (let flag in compileFlags) {
    if (node.path.original === 'if-flag-' + flag) {
      mungeNode(node, flag, false);
    }

    if (node.path.original === 'unless-flag-' + flag) {
      mungeNode(node, flag, true);
    }
  }

  if (node.path.original === 'if-flag') {
    mungePlainHelperNode(node, false);
  }

  if (node.path.original === 'unless-flag') {
    mungePlainHelperNode(node, true);
  }
}

function validate(node) {
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
}

module.exports = function(flags) {
  compileFlags = flags;
  return ConditionalTemplateCompiler;
};
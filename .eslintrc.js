module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended'
  ],
  env: {
    'browser': false,
    'es6': true,
    'node': true
  },
  globals: {
    'window': true,
    'EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS': true,
    'ENABLE_FOO': true,
    'ENABLE_BAR': true,
    'visit': true,
    'andThen': true,
    'find': true
  },
  rules: {
    'array-bracket-spacing': ['error', 'never'],
    'arrow-spacing': ['error'],
    'block-spacing': ['error'],
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    'comma-style': ['error'],
    'eqeqeq': ['error'],
    'func-call-spacing': ['error', 'never'],
    'indent': ['error', 2, {
      'ArrayExpression': 1,
      'CallExpression': { 'arguments': 1 },
      'ObjectExpression': 1,
      'SwitchCase': 1,
      'VariableDeclarator': 1
    }],
    'key-spacing': ['error'],
    'keyword-spacing': ['error'],
    'linebreak-style': ['error'],
    'no-confusing-arrow': ['error'],
    'no-trailing-spaces': ['error'],
    'no-var': ['error'],
    'object-curly-spacing': ['error', 'always'],
    'one-var-declaration-per-line': ['error'],
    'semi-spacing': ['error'],
    'space-before-blocks': ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'space-in-parens': ['error', 'never'],
    'spaced-comment': ['error', 'always', {
      'block': { 'balanced': true }
    }]
  }
};

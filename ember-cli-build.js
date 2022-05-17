/* global require, module */
const EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  const app = new EmberApp(defaults, {});

  return app.toTree();
};

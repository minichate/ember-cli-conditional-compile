/* jshint ignore:start */

import Ember from 'ember';

var feature_flags = EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS;

var initializer = {
  name: 'ember-cli-conditional-compile-helpers',
  initialize: function(container, application) {
    Object.keys(feature_flags).map(function(flag) {
      Ember.Handlebars.registerHelper('if-flag-' + flag, function(options) {
        if (feature_flags[flag]) {
          return options.fn(this);
        } else {
          return options.inverse(this);
        }
      });
    });
  }
};

export default initializer;

/* jshint ignore:end */

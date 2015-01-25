/* jshint ignore:start */

import Ember from 'ember';

var initializer = {
  name: 'ember-cli-conditional-compile-features',
  initialize: function(container, application) {
    Ember.Logger.info('Initializing feature flags');
  }
};

var feature_flags = EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS;
Object.keys(feature_flags).map(function(flag) {
  window[flag] = feature_flags[flag];
})

export default initializer;

/* jshint ignore:end */

import Ember from 'ember';
import Environment from '../config/environment';

var initializer = {
  name: 'ember-cli-conditional-compile-features',
  initialize: function(application) {
    let config = {
      enableLogs: true
    };
    let envConfig = Environment["conditional-compile-features"];
    if (typeof envConfig === "object") {
      Object.keys(envConfig).map(function(key) {
        config[key] = envConfig[key];
      });
    }
    if (config.enableLogs) {
      Ember.Logger.info('Initializing feature flags');
    }
  }
};

var feature_flags = EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS;
Object.keys(feature_flags).map(function(flag) {
  Object.defineProperty(window, flag, {
    value: feature_flags[flag],
    enumerable: true,
    configurable: false,
    writable: false
  });
});

export default initializer;

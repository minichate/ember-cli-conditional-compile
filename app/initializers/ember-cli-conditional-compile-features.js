
const initializer = {
  name: 'ember-cli-conditional-compile-features',
  initialize: function() {}
};

const feature_flags = EMBER_CLI_CONDITIONAL_COMPILE_INJECTIONS;
Object.keys(feature_flags).map(function(flag) {
  window[flag] = feature_flags[flag];
})

export default initializer;

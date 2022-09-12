module.exports = function(environment) {

  const GLOBAL_FLAGS = {
    featureFlags: {
      ENABLE_FROM_FILE: true,
      ENABLE_FROM_FILE_CLOWNSTAGE: false,
    },
    includeDirByFlag: {
      ENABLE_FROM_FILE: [],
    }
  }
  if (environment === 'clownstage') {
    GLOBAL_FLAGS.featureFlags.ENABLE_FROM_FILE_CLOWNSTAGE = true;
  }

  return GLOBAL_FLAGS
}
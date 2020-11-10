module.exports = function() {

  const GLOBAL_FLAGS = {
    featureFlags: {
      ENABLE_FOO: true,
      ENABLE_BAR: false
    },
    includeDirByFlag: {
      ENABLE_FOO: []
    }
  }
  return GLOBAL_FLAGS
}
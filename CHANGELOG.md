# Changelog

## 2.0.0

### Breaking changes

The semantics of `includeDirByFlag` have changed and now take a file glob pattern instead of a RegExp. This is because the mechanism for removing files from the build pipeline has changed to work around a bug in broccoli. (#111)

### New features

- Support for external config file to prevent leaking of feature flag names (#110)
- Support for multiple environments (For example to roll out features on a staging environment) (#110)

### Updates/Changes

- Modernised the code and all dependencies to be compatible with Ember 3.x and up (#107)
- Added @ember/string to be compatible with Ember 5.x (#117)

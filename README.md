# ember-cli-conditional-compile

[![Build Status](https://travis-ci.org/minichate/ember-cli-conditional-compile.svg?branch=master)](https://travis-ci.org/minichate/ember-cli-conditional-compile)
[![Dependency Status](https://david-dm.org/minichate/ember-cli-conditional-compile.svg)](https://david-dm.org/minichate/ember-cli-conditional-compile)
[![devDependency Status](https://david-dm.org/minichate/ember-cli-conditional-compile/dev-status.svg)](https://david-dm.org/minichate/ember-cli-conditional-compile#info=devDependencies)

The goal of ember-cli-conditional-compile is to provide easy to use feature switches to Ember applications such that code that is hidden behind a disabled feature switch is not in the compiled code.

# Getting Started

This is an ember-cli addon, so all you need to do is

```bash
    npm install --save ember-cli-conditional-compile
```

You should use the `0.3.x` series of releases if you're on Ember 1.13.6 or
older. If you're on Ember 1.13.7 you should use the `0.4.x` version.

To actually use the feature switches you'll need to add some configuration in your `environment.js` file. For example, lets pretend you want to have two feature switches; `ENABLE_FOO` and `ENABLE_BAR`:

```javascript
var ENV = {
    // other settings ...

    featureFlags: {
        ENABLE_FOO: true,
        ENABLE_BAR: true
    },
    includeDirByFlag: {
        ENABLE_FOO: [/pods\/foos/, /pods\/foo/],
        ENABLE_BAR: [],
    }
};

// other environments ...

if (environment === 'production') {
    ENV.featureFlags.ENABLE_FOO = false;
}
```

We'll look at the two new options in more detail below, but for now we can see that by default both features are enabled, but in the `production` environment `ENABLE_FOO` is disabled, and related code under the `pods/foos` and `pods/foo` directories are excluded from compilation. 

## ENV.featureFlags

This setting sets up which flags will be available to actually switch use. A value of `true` means that the flag will be enabled, `false` means that it will not be.

## ENV.includeDirByFlag

Given a key which has been defined above, the value is an array of regexes of files/paths which will _only_ be included in the compiled product if the related feature flag is enabled. In the example above, in the development environment `ENABLE_FOO` is `true`, so the `pods/foo` and `pods/foos` paths will be included.

However, since the flag is `false` in production, any code in those directories will not be compiled in.

# How it works

*ember-cli-conditional-compile* adds itself to the Broccoli compile pipeline for your Ember application. Depending on which environment you're building it acts in two different ways:

## Development and test environments
  
Global variables are injected into the page which have the current state of the feature flags. For example:

```javascript
if (ENABLE_FOO) {
    this.route('foo');
    console.log('The feature ENABLE_FOO is enabled in this environment');
}
```

will be represented in development and test environments as:

```javascript
window.ENABLE_FOO = true;

if (ENABLE_FOO) {
    this.route('foo');
    console.log('The feature ENABLE_FOO is enabled in this environment');
}
```

In Handlebars/HTMLBars templates, you can also make use of the flags using the `if-flag-` block helper:

```hbs
{{#if-flag-ENABLE_FOO}}
<p>Foo is enabled! \o/</p>
{{else}}
<p>Foo is disabled</p>
{{/if-flag-ENABLE_FOO}}
```

## Production environment

We use UglifyJS's `global_defs` feature to replace the value of feature flags with their constant values. UglifyJS's dead code implementation than cleans up unreachable code and performs inlining, such that:

```javascript
if (ENABLE_FOO) {
    this.route('foo');
    console.log('The feature ENABLE_FOO is enabled in this environment');
}
```

will be represented in the production environment as the following if `ENABLE_FOO` is configured to be `true`:

```javascript
this.route('foo');
console.log('The feature ENABLE_FOO is enabled in this environment');
```

or the following if `ENABLE_FOO` is configured to be `false`;

```javascript
// empty since the condition can never be satisfied!
```

# Licence

 This library is lovingly brought to you by the FreshBooks developers. We've released it under the MIT license.
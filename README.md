# ember-cli-conditional-compile

![Build Status](https://github.com/minichate/ember-cli-conditional-compile/actions/workflows/ci.yml/badge.svg)

The goal of ember-cli-conditional-compile is to provide easy to use feature switches to Ember applications such that code that is hidden behind a disabled feature switch is not in the compiled code.

# Getting Started

This is an ember-cli addon, so all you need to do is

```bash
    ember install ember-cli-conditional-compile
```

You should use the `0.3.x` series of releases if you're on Ember 1.13.6 or
older. If you're on Ember 1.13.7 or newer you must use at least the `0.4.x`
version.

To actually use the feature switches you'll need to add some configuration in your `environment.js` file. For example, lets pretend you want to have two feature switches; `ENABLE_FOO` and `ENABLE_BAR`:

```javascript
var ENV = {
    // other settings ...

    featureFlags: {
        ENABLE_FOO: true,
        ENABLE_BAR: true
    },
    includeDirByFlag: {
        ENABLE_FOO: ['pods/foos/**', 'pods/foo/**'],
        ENABLE_BAR: [],
    }
};

// other environments ...

if (environment === 'production') {
    ENV.featureFlags.ENABLE_FOO = false;
}
```

Alternatively, you can define your feature flags in `config/feature-flags.js` looking like this:

```javascript
module.exports = function(environment) {
    const GLOBAL_FLAGS = {
        featureFlags: {
            ENABLE_FOO: true,
            ENABLE_BAR: true
        },
        includeDirByFlag: {
            ENABLE_FOO: [/pods\/foos/, /pods\/foo/],
            ENABLE_BAR: [],
        }
    }

    if (environment === 'production') {
        GLOBAL_FLAGS.featureFlags.ENABLE_FOO = false;
    }

    return GLOBAL_FLAGS;
}
```

This has two advantages: It declutters `environment.js` a bit, especially if you have many flags, but also prevents your flag names from leaking into the application code under certain circumstances.

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

In Handlebars/HTMLBars templates, you can also make use of the flags using the `if-flag` block helper:

```hbs
{{#if-flag ENABLE_FOO}}
<p>Foo is enabled! \o/</p>
{{else}}
<p>Foo is disabled</p>
{{/if-flag}}
```

You can also use the `unless-flag` style block helper:

```hbs
{{#unless-flag ENABLE_FOO}}
<p>Foo is disabled</p>
{{else}}
<p>Foo is enabled! \o/</p>
{{/unless-flag}}
```

## Production environment

We use UglifyJS's `global_defs` feature to replace the value of feature flags with their constant values. UglifyJS's dead code implementation then cleans up unreachable code and performs inlining, such that:

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

Furthermore, if you use the HTMLBars helpers the AST transformations will shake
out and remove impossible-to-reach sides of the condition:

```hbs
{{#if-flag ENABLE_FOO}}
<p>Foo is enabled</p>
{{else}}
<p>This won't be reached, because ENABLE_FOO is true</p>
{{/if-flag}}
```

will get transformed into:

```hbs
<p>Foo is enabled</p>
```

This is really handy, since it vastly cuts down on the amount of precompiled
template code that your users need to download even though it'll never be
executed!


## Defining additional environments

By defining `ENV.featureFlagsEnvironment` you can separate your feature flags by more than just test/development/production, for example to have a beta environment that is identical to production but has a couple more flags activated. This only works if you have your flags in `config.featureFlags` - The `environment` passed in into the wrapper function will be `ENV.featureFlagsEnvironment` if set.

# Licence

 This library is lovingly brought to you by the FreshBooks developers. We've released it under the MIT license.

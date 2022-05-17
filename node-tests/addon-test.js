'use strict';

const co = require('co');
const assert = require('chai').assert;
const expect = require('chai').expect;
const CoreObject = require('core-object');
const AddonMixin = require('../index');
const BroccoliTestHelper = require('broccoli-test-helper');
const CommonTags = require('common-tags');
const stripIndent = CommonTags.stripIndent;
const createBuilder = BroccoliTestHelper.createBuilder;
const createTempDir = BroccoliTestHelper.createTempDir;


let Addon = CoreObject.extend(AddonMixin);

describe('ember-cli-conditional-compile', function() {

  beforeEach(function() {
    let project = {
      root: __dirname,
      config: function() {
        return {
          featureFlags: {
            ENABLE_FOO: true
          }
        }
      }
    };
    this.addon = new Addon({
      project,
      parent: project,
    });
  });

  describe('transpileTree', function() {
    this.timeout(0);

    let input;
    let output;
    let subject;

    beforeEach(co.wrap(function* () {
      input = yield createTempDir();
    }));

    afterEach(co.wrap(function* () {
      yield input.dispose();
      yield output.dispose();
    }));

    describe('in developemt', function() {
      it("keeps the flag in development", co.wrap(function* () {
        process.env.EMBER_ENV = 'development';

        let contents = stripIndent`
        if (ENABLE_FOO) {
          console.log('Feature Mode!');
        }
        `;

        input.write({
          "foo.js": contents
        });

        subject = this.addon.transpileTree(input.path());

        output = createBuilder(subject);

        yield output.build();

        expect(
          output.read()
        ).to.deep.equal({
          "foo.js": `if (ENABLE_FOO) {\n  console.log('Feature Mode!');\n}`
        });
      }));
    });
    describe('when minification is enabled', function() {
      it("inlines the feature flags value", co.wrap(function* () {
        process.env.EMBER_ENV = 'development';

        let contents = stripIndent`
        if (ENABLE_FOO) {
          console.log('Feature Mode!');
        }
        `;

        input.write({
          "foo.js": contents
        });
        this.addon.enableCompile = true;
        subject = this.addon.transpileTree(input.path());

        output = createBuilder(subject);

        yield output.build();

        expect(
          output.read()
        ).to.deep.equal({
          "foo.js": `if (true) {\n  console.log('Feature Mode!');\n}`
        });
      }));
    });
  });
});

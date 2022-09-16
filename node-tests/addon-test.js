'use strict';

const co = require('co');
const expect = require('chai').expect;
const CoreObject = require('core-object');
const path = require('path');
const AddonMixin = require('../index');
const BroccoliTestHelper = require('broccoli-test-helper');
const CommonTags = require('common-tags');
const stripIndent = CommonTags.stripIndent;
const createBuilder = BroccoliTestHelper.createBuilder;
const createTempDir = BroccoliTestHelper.createTempDir;

let Addon = CoreObject.extend(AddonMixin);

describe('ember-cli-conditional-compile', function() {

  describe('transpileTree', function() {
    this.timeout(0);

    let input;
    let output;
    let subject;

    beforeEach(co.wrap(function* () {
      input = yield createTempDir();

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
        parent: project
      });
      this.addon.readConfig();
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

  describe('with extra config file', function() {

    this.timeout(0);

    let input;
    let output;
    let subject;


    beforeEach(co.wrap(function* () {
      input = yield createTempDir();

      let project = {
        root: path.join(__dirname, 'with-extra-config-file'),
        config: function() {
          return {}
        }
      };
      this.addon = new Addon({
        project,
        parent: project
      });
      this.addon.readConfig();
    }));

    afterEach(co.wrap(function* () {
      yield input.dispose();
      yield output.dispose();
    }));

    describe('when minification is enabled', function() {
      it("inlines the feature flags value", co.wrap(function* () {
        process.env.EMBER_ENV = 'development';

        let contents = stripIndent`
        if (ENABLE_FROM_FILE) {
          console.log('Feature Mode!');
        }
        `;
        let clownContents = stripIndent`
        if (ENABLE_FROM_FILE_CLOWNSTAGE) {
          console.log('Feature Mode!');
        }
        `;

        input.write({
          "foo.js": contents,
          'clown.js': clownContents,
        });

        this.addon.enableCompile = true;
        subject = this.addon.transpileTree(input.path());

        output = createBuilder(subject);

        yield output.build();

        expect(
          output.read()
        ).to.deep.equal({
          "foo.js": `if (true) {\n  console.log('Feature Mode!');\n}`,
          "clown.js": `if (false) {\n  console.log('Feature Mode!');\n}`
        });
      }));

      it("respects additional environments", co.wrap(function* () {
        process.env.EMBER_ENV = 'development';

        let project = {
          root: path.join(__dirname, 'with-extra-config-file'),
          config: function() {
            return {
              featureFlagsEnvironment: 'clownstage'
            }
          }
        };
        this.addon = new Addon({
          project,
          parent: project
        });
        this.addon.readConfig();

        let contents = stripIndent`
        if (ENABLE_FROM_FILE) {
          console.log('Feature Mode!');
        }
        `;
        let clownContents = stripIndent`
        if (ENABLE_FROM_FILE_CLOWNSTAGE) {
          console.log('Feature Mode!');
        }
        `;

        input.write({
          "foo.js": contents,
          'clown.js': clownContents,
        });

        this.addon.enableCompile = true;
        subject = this.addon.transpileTree(input.path());

        output = createBuilder(subject);

        yield output.build();

        expect(
          output.read()
        ).to.deep.equal({
          "foo.js": `if (true) {\n  console.log('Feature Mode!');\n}`,
          "clown.js": `if (true) {\n  console.log('Feature Mode!');\n}`
        });
      }));
    });
  })
});

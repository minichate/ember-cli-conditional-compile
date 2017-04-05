import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('Compiler | precompile', {
  integration: true
});

test('precompile enabled flags', function(assert) {
  this.render(hbs`
    {{#if-flag-ENABLE_FOO}}Foo{{/if-flag-ENABLE_FOO}}
  `);

  assert.equal(this.$().text().trim(), 'Foo');
});

test('precompile {{unless-flag}} enabled flags', function(assert) {
  this.render(hbs`
    {{#unless-flag-ENABLE_FOO}}Foo{{/unless-flag-ENABLE_FOO}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('precompile disabled flags', function(assert) {
  this.render(hbs`
    {{#if-flag-ENABLE_BAR}}Bar{{/if-flag-ENABLE_BAR}}
  `);

  assert.equal(this.$().text().trim(), '');
});

test('precompile {{unless-flag}} disabled flags', function(assert) {
  this.render(hbs`
    {{#unless-flag-ENABLE_BAR}}Bar{{/unless-flag-ENABLE_BAR}}
  `);

  assert.equal(this.$().text().trim(), 'Bar');
});

test('precompile else block', function(assert) {
  this.render(hbs`
    {{#if-flag-ENABLE_BAR}}Bar{{else}}Baz{{/if-flag-ENABLE_BAR}}
  `);

  assert.equal(this.$().text().trim(), 'Baz');
});

test('precompile {{unless-flag}} else block', function(assert) {
  this.render(hbs`
    {{#unless-flag-ENABLE_BAR}}Bar{{else}}Baz{{/unless-flag-ENABLE_BAR}}
  `);

  assert.equal(this.$().text().trim(), 'Bar');
});

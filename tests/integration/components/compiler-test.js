import { module, test } from 'qunit';
import { setupRenderingTest } from '../../helpers/index';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | compiler', function(hooks) {
  setupRenderingTest(hooks);

  test('precompile enabled flags', async function(assert) {
    await render(hbs`
      {{#if-flag-ENABLE_FOO}}Foo{{/if-flag-ENABLE_FOO}}
    `);

    assert.dom(this.element).hasText('Foo');
  });

  test('precompile {{unless-flag}} enabled flags', async function(assert) {
    render(hbs`
      {{#unless-flag-ENABLE_FOO}}Foo{{/unless-flag-ENABLE_FOO}}
    `);

    assert.dom(this.element).hasText('');
  });

  test('precompile enabled flags', async function(assert) {
    await render(hbs`
      {{#if-flag-ENABLE_FOO}}Foo{{/if-flag-ENABLE_FOO}}
    `);

    assert.dom(this.element).hasText('Foo');
  });

  test('precompile {{unless-flag}} enabled flags', async function(assert) {
    await render(hbs`
      {{#unless-flag-ENABLE_FOO}}Foo{{/unless-flag-ENABLE_FOO}}
    `);

    assert.dom(this.element).hasText('');
  });

  test('precompile disabled flags', async function(assert) {
    await render(hbs`
      {{#if-flag-ENABLE_BAR}}Bar{{/if-flag-ENABLE_BAR}}
    `);

    assert.dom(this.element).hasText('');
  });

  test('precompile {{unless-flag}} disabled flags', async function(assert) {
    await render(hbs`
      {{#unless-flag-ENABLE_BAR}}Bar{{/unless-flag-ENABLE_BAR}}
    `);

    assert.dom(this.element).hasText('Bar');
  });

  test('precompile else block', async function(assert) {
    await render(hbs`
      {{#if-flag-ENABLE_BAR}}Bar{{else}}Baz{{/if-flag-ENABLE_BAR}}
    `);

    assert.dom(this.element).hasText('Baz');
  });

  test('precompile {{unless-flag}} else block', async function(assert) {
    await render(hbs`
      {{#unless-flag-ENABLE_BAR}}Bar{{else}}Baz{{/unless-flag-ENABLE_BAR}}
    `);

    assert.dom(this.element).hasText('Bar');
  });
});



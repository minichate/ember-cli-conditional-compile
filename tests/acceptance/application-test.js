import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit'
import { visit, find, findAll } from '@ember/test-helpers'

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  test('enabled flags are shown', async function(assert) {
    await visit('/');

    assert.equal(findAll('.enabled_foo').length, 1);
    assert.equal(find('.enabled_foo').textContent, 'ENABLED_FOO!! \\o/');
  });

  test('enabled flags are shown for unless helper', async function(assert) {
    await visit('/');

    assert.equal(findAll('.unless_disabled_foo').length, 1);
    assert.equal(find('.unless_disabled_foo').textContent, 'DISABLED_FOO!! \\o/');
  });

  test('disabled flags are not shown', async function(assert) {
    await visit('/');

    assert.equal(find('.enabled_bar'), null);
  });

  test('disabled else blocks are shown', async function(assert) {
    await visit('/');

    assert.equal(findAll('.disabled_bar').length, 1);
    assert.equal(find('.disabled_bar').textContent, 'DISABLED_BAR!! \\o/');
  });

  test('enabled else blocks are not shown', async function(assert) {
    await visit('/');

    assert.equal(find('.disabled_foo'), null);
  });

  test('new style flag enabled blocks are shown', async function(assert) {
    await visit('/');

    assert.equal(findAll('.new_flag_enabled_foo').length, 1);
    assert.equal(find('.new_flag_disabled_foo'), null);
  });

  test('new style unless flag enabled blocks are shown', async function(assert) {
    await visit('/');

    assert.equal(findAll('.new_flag_unless_enabled_bar').length, 1);
    assert.equal(find('.new_flag_unless_disabled_bar'), null);
  });
});
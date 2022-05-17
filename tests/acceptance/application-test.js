import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers/index';

module('Acceptance | application', function(hooks) {
  setupApplicationTest(hooks);

  test('enabled flags are shown', async function(assert) {
    await visit('/');
    assert.dom('.enabled_foo').exists().hasText('ENABLED_FOO!! \\o/');
  });

  test('enabled flags are shown for unless helper', async function(assert) {
    await visit('/');

    assert.dom('.unless_disabled_foo').exists().hasText('DISABLED_FOO!! \\o/')
  });

  test('disabled flags are not shown', async function(assert) {
    await visit('/');

    assert.dom('enabled_bar').doesNotExist();
  });

  test('disabled else blocks are shown', async function(assert) {
    await visit('/');

    assert.dom('.disabled_bar').exists().hasText('DISABLED_BAR!! \\o/')
  });

  test('enabled else blocks are not shown', async function(assert) {
    await visit('/');

    assert.dom('.disabled_foo').doesNotExist();
  });

  test('new style flag enabled blocks are shown', async function(assert) {
    await visit('/');

    assert.dom('.new_flag_enabled_foo').exists()
    assert.dom('.new_flag_disabled_foo').doesNotExist()
  });

  test('new style unless flag enabled blocks are shown', async function(assert) {
    await visit('/');

    assert.dom('.new_flag_unless_enabled_bar').exists()
    assert.dom('.new_flag_unless_disabled_bar').doesNotExist()
  });
});





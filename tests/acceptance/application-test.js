import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | application');

test('enabled flags are shown', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.enabled_foo').length, 1);
  });
});

test('disabled flags are not shown', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.enabled_bar').length, 0);
  });
});

test('disabled else blocks are shown', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.disabled_bar').length, 1);
  });
});

test('enabled else blocks are not shown', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(find('.disabled_foo').length, 0);
  });
});

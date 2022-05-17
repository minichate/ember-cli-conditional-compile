import { module, test } from 'qunit';
import { setupTest } from '../../helpers/index';

module('Unit | Controller | application', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it can access set properties', function(assert) {
    let controller = this.owner.lookup('controller:application');

    assert.ok(controller);
    assert.equal(true, controller.get('foo'));
    assert.equal(false, controller.get('bar'));
  });
});
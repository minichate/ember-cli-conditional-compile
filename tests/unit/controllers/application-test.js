import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit';



module('controller:application', 'Unit | Controller | application', function(hooks) {
  setupTest(hooks);

  test('properties are set correctly', function(assert) {
    let controller = this.owner.lookup('controller:application');
    assert.ok(controller);

    assert.equal(true, controller.get('foo'));
    assert.equal(false, controller.get('bar'));
  });

});

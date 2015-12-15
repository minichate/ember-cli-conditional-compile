/* globals ENABLE_FOO */
/* globals ENABLE_BAR */

import Ember from 'ember';

export default Ember.Controller.extend({
  foo: Ember.on('init', Ember.computed(() => {
    return ENABLE_FOO;
  })),

  bar: Ember.on('init', Ember.computed(() => {
    return ENABLE_BAR;
  }))
});

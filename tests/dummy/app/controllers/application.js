import Ember from 'ember';

export default Ember.Controller.extend({
  foo: Ember.computed(() => {
    return ENABLE_FOO;
  }),

  bar:  Ember.computed(() => {
    return ENABLE_BAR;
  })
});

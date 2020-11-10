import Controller from '@ember/controller';
import { computed } from '@ember/object'

export default Controller.extend({
  foo: computed(function() {
    return ENABLE_FOO;
  }),

  bar: computed(function() {
    return ENABLE_BAR;
  })
});

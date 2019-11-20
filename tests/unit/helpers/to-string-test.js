import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { htmlSafe } from '@ember/template';
import { toString } from 'ember-froala-editor/helpers/to-string';

module('Unit | Helper | to-string', function(hooks) {
  setupTest(hooks);

  test('htmlSafe() content is converted to a string', function(assert) {
    let html = htmlSafe('<p>Foobar</p>');
    let callback = content => typeof content === 'string';
    assert.ok(toString(callback)(html));
  });

  test('partial application parameters are applied', function(assert) {
    let html = htmlSafe('<p>Foobar</p>');
    let partial = true;
    let callback = (content, param) => param;
    assert.ok(toString(callback, partial)(html));
  });

  test('event arguments are applied', function(assert) {
    let html = htmlSafe('<p>Foobar</p>');
    let arg = true;
    let callback = (content, param) => param;
    assert.ok(toString(callback)(html, arg));
  });

  test('partial application parameters and event arguments are applied', function(assert) {
    let html = htmlSafe('<p>Foobar</p>');
    let partial = true;
    let arg = true;
    let callback = (content, param1, param2) => param2;
    assert.ok(toString(callback, partial)(html, arg));
  });

});

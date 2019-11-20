import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { isHTMLSafe } from '@ember/template';
import { htmlSafe } from 'ember-froala-editor/helpers/html-safe';

module('Unit | Helper | html-safe', function(hooks) {
  setupTest(hooks);

  test('string content is converted to a SafeString', function(assert) {
    let html = '<p>Foobar</p>';
    let callback = content => isHTMLSafe(content);
    assert.ok(htmlSafe(callback)(html));
  });

  test('partial application parameters are applied', function(assert) {
    let html = '<p>Foobar</p>';
    let partial = true;
    let callback = (content, param) => param;
    assert.ok(htmlSafe(callback, partial)(html));
  });

  test('event arguments are applied', function(assert) {
    let html = '<p>Foobar</p>';
    let arg = true;
    let callback = (content, param) => param;
    assert.ok(htmlSafe(callback)(html, arg));
  });

  test('partial application parameters and event arguments are applied', function(assert) {
    let html = '<p>Foobar</p>';
    let partial = true;
    let arg = true;
    let callback = (content, param1, param2) => param2;
    assert.ok(htmlSafe(callback, partial)(html, arg));
  });

});

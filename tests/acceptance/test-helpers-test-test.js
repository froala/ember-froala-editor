import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import {
  fillInFroalaEditor,
  getInFroalaEditor,
} from 'ember-froala-editor/test-support';

module('Acceptance | test helpers test', function (hooks) {
  setupApplicationTest(hooks);

  test('test getInFroalaEditor() and fillInFroalaEditor()', async function (assert) {
    assert.expect(3);

    await visit('/');
    assert.strictEqual(getInFroalaEditor('#editor'), '<p>Foobar</p>');

    await fillInFroalaEditor('#editor', '<p>Foobaz</p>');
    assert.strictEqual(getInFroalaEditor('#editor'), '<p>Foobaz</p>');

    // Test helpers throw when selector does not find an element
    assert.throws(() => getInFroalaEditor('#foobar'));
  });
});

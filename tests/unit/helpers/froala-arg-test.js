import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { froalaArg } from 'ember-froala-editor/helpers/froala-arg';

module('Unit | Helper | froala-arg', function (hooks) {
  setupTest(hooks);

  test('bound editor context is returned to the callback as the first arg', function (assert) {
    let editor = { froala: 'editor' };
    let callback = (editor) => editor;
    assert.deepEqual(froalaArg(callback).bind(editor)(), editor);
  });

  test('partial application parameters are applied', function (assert) {
    let editor = { froala: 'editor' };
    let check = 'foobar';
    let callback = (editor, param1) => param1;
    assert.strictEqual(froalaArg(callback, check).bind(editor)(), check);
  });

  test('event arguments are applied', function (assert) {
    let editor = { froala: 'editor' };
    let check = 'foobar';
    let callback = (editor, param1) => param1;
    assert.strictEqual(froalaArg(callback).bind(editor)(check), check);
  });

  test('partial application parameters and event arguments are applied', function (assert) {
    let editor = { froala: 'editor' };
    let check1 = 'foobar';
    let check2 = 'foobaz';
    let callback = (editor, param1, param2) => param2;
    assert.strictEqual(
      froalaArg(callback, check1).bind(editor)(check2),
      check2,
    );
  });

  test('calling the helper twice on the same callback asserts', function (assert) {
    let callback1 = (editor) => editor;
    let callback2 = froalaArg(callback1);
    assert.throws(() => froalaArg(callback2));
  });

  test('helper function called without a callback asserts', function (assert) {
    assert.throws(() => froalaArg());
  });
});

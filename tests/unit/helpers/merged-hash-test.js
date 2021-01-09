import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { mergedHash } from 'ember-froala-editor/helpers/merged-hash';

module('Unit | Helper | merged-hash', function (hooks) {
  setupTest(hooks);

  test('returns a passed in hash param', function (assert) {
    let hash = { foo: 'bar' };
    // Ex: (merged-hash {foo:"bar"}) << at least a bound prop that is a hash like such
    let result = mergedHash(hash);
    assert.deepEqual(result, hash);
  });

  test('returns the helper hash', function (assert) {
    let hash = { foo: 'bar' };
    // Ex: (merged-hash foo="bar")
    let result = mergedHash(hash);
    assert.deepEqual(result, hash);
  });

  test('merges param hash and the actual helper hash', function (assert) {
    // Ex: (merged-hash {foo:1} bar=2)
    let result = mergedHash({ foo: 1 }, { bar: 2 });
    assert.deepEqual(result, { foo: 1, bar: 2 });
  });

  test('merges multiple param hashes and the actual helper hash', function (assert) {
    // Ex: (merged-hash {foo:1} {bar:2} baz=3)
    let result = mergedHash({ foo: 1 }, { bar: 2 }, { baz: 3 });
    assert.deepEqual(result, { foo: 1, bar: 2, baz: 3 });
  });

  test('merges param hashes and the helper hash with multiple properties', function (assert) {
    // Ex: (merged-hash {foo:1} bar=2 baz=3)
    let result = mergedHash({ foo: 1 }, { bar: 2, baz: 3 });
    assert.deepEqual(result, { foo: 1, bar: 2, baz: 3 });
  });

  test('merges multiple param hashes and the helper hash with multiple properties', function (assert) {
    // Ex: (merged-hash {foo:1} {bar:2} baz=3 raz=4)
    let result = mergedHash({ foo: 1 }, { bar: 2 }, { baz: 3, raz: 4 });
    assert.deepEqual(result, { foo: 1, bar: 2, baz: 3, raz: 4 });
  });
});

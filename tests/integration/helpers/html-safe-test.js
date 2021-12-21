import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | html-safe', function (hooks) {
  setupRenderingTest(hooks);

  test('HTML content is rendered as HTML', async function (assert) {
    this.set('content', '<p>foobar</p>');

    await render(hbs`{{html-safe this.content}}`);

    assert.strictEqual(this.element.textContent.trim(), 'foobar');
  });

  test('undefined is rendered without error', async function (assert) {
    this.set('content', undefined);

    await render(hbs`{{html-safe this.content}}`);

    assert.strictEqual(this.element.textContent.trim(), '');
  });

  test('null is rendered without error', async function (assert) {
    this.set('content', null);

    await render(hbs`{{html-safe this.content}}`);

    assert.strictEqual(this.element.textContent.trim(), '');
  });
});

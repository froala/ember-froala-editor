import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { htmlSafe } from '@ember/template';

module('Integration | Helper | to-string', function (hooks) {
  setupRenderingTest(hooks);

  test('HTML content is rendered as text', async function (assert) {
    this.set('content', htmlSafe('<p>foobar</p>'));

    await render(hbs`{{to-string this.content}}`);

    assert.equal(this.element.textContent.trim(), '<p>foobar</p>');
  });

  test('undefined is rendered without error', async function (assert) {
    this.set('content', undefined);

    await render(hbs`{{to-string this.content}}`);

    assert.equal(this.element.textContent.trim(), '');
  });

  test('null is rendered without error', async function (assert) {
    this.set('content', null);

    await render(hbs`{{to-string this.content}}`);

    assert.equal(this.element.textContent.trim(), '');
  });
});

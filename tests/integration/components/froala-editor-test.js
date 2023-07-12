import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { next } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import {
  render,
  clearRender,
  settled,
  click,
  find,
  waitUntil,
} from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { fillInFroalaEditor } from 'ember-froala-editor/test-support';
import FroalaEditor from 'froala-editor';

module('Integration | Component | froala-editor', function (hooks) {
  setupRenderingTest(hooks);

  test('@on-initialized event callback is triggered', async function (assert) {
    this.set('initializedCallback', () => {
      assert.ok(true);
    });

    await render(hbs`
      <FroalaEditor
        @on-initialized={{this.initializedCallback}}
      />`);
  });

  test('@on-initializationDelayed event callback is triggered when using the initOnClick option', async function (assert) {
    this.set('initializedCallback', () => {
      assert.ok(true);
    });

    await render(hbs`
      <FroalaEditor
        @initOnClick={{true}}
        @on-initializationDelayed={{this.initializedCallback}}
      />
    `);
  });

  test('@on-initialized event action is fired after editor is clicked when using the initOnClick option', async function (assert) {
    this.set('initializedCallback', () => {
      assert.ok(true);
    });

    await render(hbs`
      <FroalaEditor
        @options={{hash initOnClick=true}}
        @on-initialized={{this.initializedCallback}}
      />
    `);

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    await click('div.fr-view');
  });

  test('@content changes while the editor is NOT initialized', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('initializedCallback', (editor) => {
      editor.destroy();
      this.set('foo', foobaz);
      assert.strictEqual(this.element.textContent.trim(), 'Foobaz');
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@content changes while the editor is initialized', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('initializedCallback', (editor) => {
      this.set('foo', foobaz);
      assert.strictEqual(editor.html.get(), foobaz.toString());
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@updated setter called when content changes', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('initializedCallback', (editor) => {
      editor.html.set(foobaz.toString());
      editor.undo.saveStep();
    });

    this.set('setFoo', (html) => {
      assert.strictEqual(html.toString(), foobaz.toString());
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @update={{this.setFoo}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@updated setter works with a different event name', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('initializedCallback', (editor) => {
      editor.html.set(foobaz.toString());
      editor.events.trigger('blur');
    });

    this.set('setFoo', (html) => {
      assert.strictEqual(html.toString(), foobaz.toString());
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @update={{this.setFoo}}
        @updateEvent="blur"
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@updated setter called when editor is destroyed but content changed', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('initializedCallback', (editor) => {
      editor.html.set(foobaz.toString());
      editor.undo.saveStep();
      editor.destroy();
    });

    this.set('setFoo', (html) => {
      assert.strictEqual(html.toString(), foobaz.toString());
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @update={{this.setFoo}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('multiple contentChanged callbacks are called', async function (assert) {
    let foobar = htmlSafe('<p>Foobar</p>');
    let foobaz = htmlSafe('<p>Foobaz</p>');

    this.set('foo', foobar);

    this.set('runAssert', () => {
      assert.ok(true);
    });

    this.set('initializedCallback', (editor) => {
      editor.html.set(foobaz.toString());
      editor.undo.saveStep();
    });

    await render(hbs`
      <FroalaEditor
        @content={{this.foo}}
        @update={{this.runAssert}}
        @on-contentChanged={{this.runAssert}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@on-destroy callback is triggered when un-rendered', async function (assert) {
    this.set('destroyedCallback', () => {
      assert.ok(true);
    });
    await render(hbs`<FroalaEditor @on-destroy={{this.destroyedCallback}} />`);

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    await clearRender();
  });

  test('@options argument applies to the editor', async function (assert) {
    this.set('initializedCallback', () => {
      assert.dom('div').hasClass('gray-theme');
    });

    await render(hbs`
      <FroalaEditor
        @options={{hash theme="gray"}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('individual @option arguments apply to the editor', async function (assert) {
    this.set('initializedCallback', () => {
      assert.dom('div').hasClass('gray-theme');
    });

    await render(hbs`
      <FroalaEditor
        @theme="gray"
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('@individual arguments override the @options argument', async function (assert) {
    this.set('initializedCallback', () => {
      assert.dom('div').hasClass('dark-theme');
    });

    await render(hbs`
      <FroalaEditor
        @theme="dark"
        @options={{hash theme="gray"}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('extended defaultOptions are properly applied', async function (assert) {
    this.set('initializedCallback', () => {
      assert.dom('div').hasClass('gray-theme');
    });

    await render(hbs`
      <ExtendedFroalaEditor
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('overridden extended defaultOptions are properly applied', async function (assert) {
    this.set('initializedCallback', () => {
      assert.dom('div').hasClass('dark-theme');
    });

    await render(hbs`
      <ExtendedFroalaEditor
        @options={{hash theme="dark"}}
        @on-initialized={{this.initializedCallback}}
      />
    `);
  });

  test('extended defaultEventCallbacks are properly called', async function (assert) {
    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`
      <ExtendedFroalaEditor
        @runAssert={{this.runAssert}}
      />
    `);
  });

  test('overridden extended defaultEventCallbacks are properly called', async function (assert) {
    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`
      <ExtendedFroalaEditor
        @on-initialized={{this.runAssert}}
      />
    `);
  });

  test('fillInFroalaEditor() triggers the @update callback', async function (assert) {
    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`
      <FroalaEditor
        @update={{this.runAssert}}
        id="myEditor"
      />
    `);

    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    await fillInFroalaEditor('#myEditor', '<p>Foobar</p>');

    await settled();
  });

  test('FroalaEditor does not have a component property', async function (assert) {
    await render(hbs`<div id="editor"><p>Foobar</p></div>`);

    let element = find('#editor');

    let editor = null;

    new FroalaEditor(element, {}, function () {
      editor = this;
    });

    await waitUntil(() => editor !== null);

    assert.strictEqual(typeof editor.component, 'undefined');
  });

  test('initial @disabled state is applied', async function (assert) {
    this.set('checkDisabledState', (editor) => {
      assert.ok(editor.edit.isDisabled());
    });

    await render(hbs`
      <FroalaEditor
        @disabled={{true}}
        @on-initialized={{this.checkDisabledState}}
      />
    `);
  });

  test('updated @disabled state is applied', async function (assert) {
    let expectedAssertions = 1;
    let assertionsRan = 0;

    this.set('disabled', false);

    this.set('enableDisabled', () => {
      next(this, () => {
        this.set('disabled', true);
      });
    });

    this.set('editOff', () => {
      assert.ok(true);
      assertionsRan++;
    });

    await render(hbs`
      <FroalaEditor
        @disabled={{this.disabled}}
        @on-initialized={{this.enableDisabled}}
        @on-edit-off={{this.editOff}}
      />
    `);

    await waitUntil(() => {
      return assertionsRan >= expectedAssertions;
    });
  });

  test('initial @disabled state does not double trigger the @on-edit-off callback', async function (assert) {
    let expectedAssertions = 2;
    let assertionsRan = 0;
    // assert.expect(expectedAssertions);

    this.set('disabled', true);

    this.set('disableDisabled', () => {
      next(this, () => {
        this.set('disabled', false);
      });
    });

    this.set('editOn', () => {
      assert.ok(true);
      assertionsRan++;
      next(this, () => {
        this.set('disabled', true);
      });
    });

    this.set('editOff', () => {
      assert.ok(true);
      assertionsRan++;
    });

    await render(hbs`
      <FroalaEditor
        @disabled={{this.disabled}}
        @on-initialized={{this.disableDisabled}}
        @on-edit-on={{this.editOn}}
        @on-edit-off={{this.editOff}}
      />
    `);

    await waitUntil(() => {
      return assertionsRan >= expectedAssertions;
    });
  });
});

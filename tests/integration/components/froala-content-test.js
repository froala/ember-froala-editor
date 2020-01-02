import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { htmlSafe } from '@ember/template';

module('Integration | Component | froala-content', function(hooks) {
  setupRenderingTest(hooks);

  test('.fr-view class is applied', async function(assert) {
    await render(hbs`<FroalaContent />`);
    assert.dom('div').hasClass('fr-view');
  });

  // Test fails on scenarios < ember 3.9
  // https://github.com/rwjblue/ember-angle-bracket-invocation-polyfill/issues/62
  // test('custom class names are applied', async function(assert) {
  //   assert.expect(2);
  //   await render(hbs`<FroalaContent class="foobar" />`);
  //   assert.dom('div').hasClass('fr-view');
  //   assert.dom('div').hasClass('foobar');
  // });

  test('passed in id is applied', async function(assert) {
    await render(hbs`<FroalaContent id="myEditor" />`);
    assert.dom('#myEditor').exists();
  });

  test('@content is output inside the block', async function(assert) {
    this.set('content', htmlSafe('foobar'))
    await render(hbs`<FroalaContent @content={{this.content}} />`);
    assert.equal(this.element.textContent.trim(), 'foobar');
  });

  test("block content is properly yield'ed", async function(assert) {
    this.set('content', htmlSafe('foobar'))
    await render(hbs`<FroalaContent>{{this.content}}</FroalaContent>`);
    assert.equal(this.element.textContent.trim(), 'foobar');
  });

});

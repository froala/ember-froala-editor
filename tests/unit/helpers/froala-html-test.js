import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { isHTMLSafe } from '@ember/template';
import { froalaHtml } from 'ember-froala-editor/helpers/froala-html';

module('Unit | Helper | froala-html', function (hooks) {
  setupTest(hooks);

  test('helper function called with explicitly passed in editor', function (assert) {
    assert.expect(1);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    let setter = (content) => assert.equal(content.toString(), html);
    let closure = froalaHtml(setter);
    closure(editor);
  });

  test('helper function called with called context as the editor', function (assert) {
    assert.expect(1);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    // Ex: {{froala-html this.setter}}
    let setter = (content) => assert.equal(content.toString(), html);
    let closure = froalaHtml(setter).bind(editor);
    closure();
  });

  test('additional arguments passed into the helper are available to the setter', function (assert) {
    assert.expect(1);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    // Ex: {{froala-html this.setter this.htmlHere}}
    let setter = (content, editor, htmlHere) => assert.equal(htmlHere, html);
    let closure = froalaHtml(setter, true, html);
    closure(editor);
  });

  test('additional arguments passed into the closure are available to the setter', function (assert) {
    assert.expect(1);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    // Ex: @on-paste-afterCleanup={{froala-html this.setter}}
    let setter = (content, editor, clipboard_html) =>
      assert.equal(clipboard_html, html);
    let closure = froalaHtml(setter);
    closure(editor, html);
  });

  test('additional arguments passed into the helper and closure are available to the setter', function (assert) {
    assert.expect(2);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    // Ex: @on-paste-afterCleanup={{froala-html this.setter this.html}}
    let setter = (content, editor, check1, check2) => {
      assert.equal(check1, html);
      assert.equal(check2, html);
    };
    let closure = froalaHtml(setter, true, html);
    closure(editor, html);
  });

  test('helper returns a strign when the returnSafeString named param is false', function (assert) {
    assert.expect(1);
    let html = '<p>Foobar</p>';
    let editor = {
      // Mock an editor instance
      component: {}, // Mock the component reference
      html: {
        get() {
          return html;
        },
      },
    };
    // Ex: @on-some-event={{froala-html this.setter returnSafeString=false}}
    let setter = (content) => assert.notOk(isHTMLSafe(content));
    let closure = froalaHtml(setter, false);
    closure(editor);
  });

  test('helper function called without any editor asserts', function (assert) {
    let setter = () => {};
    let closure = froalaHtml(setter);
    assert.throws(() => closure());
  });

  test('helper function called without any closure asserts', function (assert) {
    // Ex: {{froala-html}}
    assert.throws(() => froalaHtml());
  });
});

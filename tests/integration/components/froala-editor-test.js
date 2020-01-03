import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { isHTMLSafe, htmlSafe } from '@ember/string';
import $ from 'jquery';

module('Integration | Component | froala-editor', function(hooks) {
  setupRenderingTest(hooks);



  test("'on-initialized' event action is firing", async function(assert) {

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor on-initialized=(action runAssert)}}`);

  });



  test("'on-initializationDelayed' event action is firing when using the 'initOnClick' option", async function(assert) {

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor options=(hash initOnClick=true) on-initializationDelayed=(action runAssert)}}`);

  });



  // Need help on the following test, second assert never runs. Need 'wait()' helper??
  /* test("'on-initialized' event action is fired after editor is clicked when using the 'initOnClick' option", function(assert) {
    assert.expect(2);

    this.set('initializationDelayedTriggered', () => {
      let $editor = this.$('.froala-editor-instance');
      assert.equal($editor.length, 1);
      $editor.click();
    });

    this.set('initializedTriggered', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor options=(hash initOnClick=true) on-initializationDelayed=(action initializationDelayedTriggered) on-initialized=(action initializedTriggered)}}`);

  }); */



  test('.fr-box class is applied', async function(assert) {

    this.set('runAssert', component => {
      assert.ok($(component.get('editorSelector'), component.element).hasClass('fr-box'));
    });

    await render(hbs`{{froala-editor on-initialized=(action runAssert)}}`);

  });



  test("'content' attribute is set as editor content", async function(assert) {

    let foobar = '<p>Foobar</p>';

    this.set('runAssert', component => {
      assert.equal(component.get('editor').html.get(), foobar);
    });

    this.set('foobar', foobar);

    await render(hbs`{{froala-editor content=foobar on-initialized=(action runAssert)}}`);

  });



  test("positional param 'content' attribute is set as editor content", async function(assert) {

    let foobar = '<p>Foobar</p>';

    this.set('runAssert', component => {
      assert.equal(component.get('editor').html.get(), foobar);
    });

    this.set('foobar', foobar);

    await render(hbs`{{froala-editor foobar on-initialized=(action runAssert)}}`);

  });



  test("'update' action fires after input", async function(assert) {

    this.set('triggerContentChanged', component => {
      component.get('editor').events.trigger('contentChanged');
    });

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor on-initialized=(action triggerContentChanged) update=(action runAssert)}}`);

  });



  test("positional param 'update' action fires after input", async function(assert) {

    this.set('triggerContentChanged', component => {
      component.get('editor').events.trigger('contentChanged');
    });

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor "foobar" (action runAssert) on-initialized=(action triggerContentChanged)}}`);

  });



  test("'update' action fires for a different 'updateEvent'", async function(assert) {

    this.set('triggerContentChanged', component => {
      component.get('editor').events.trigger('keyPress');
    });

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor on-initialized=(action triggerContentChanged) update=(action runAssert) updateEvent="keyPress"}}`);

  });



  test("'theme' option applies the proper class", async function(assert) {

    this.set('runAssert', component => {
      // This is brittle, find a better way to detect that an option has been applied
      assert.ok($(component.get('editorSelector'), component.element).hasClass('red-theme'));
    });

    await render(hbs`{{froala-editor options=(hash theme="red") on-initialized=(action runAssert)}}`);

  });



  test("'theme' attribute applies the proper class", async function(assert) {

    this.set('runAssert', component => {
      // This is brittle, find a better way to detect that an option has been applied
      assert.ok($(component.get('editorSelector'), component.element).hasClass('red-theme'));
    });

    await render(hbs`{{froala-editor theme="red" on-initialized=(action runAssert)}}`);

  });



  test("positional param options, 'theme' applies the proper class", async function(assert) {

    this.set('foobar', '<p>foobar</p>');

    this.set('runAssert', component => {
      // This is brittle, find a better way to detect that an option has been applied
      assert.ok($(component.get('editorSelector'), component.element).hasClass('red-theme'));
    });

    await render(hbs`{{froala-editor foobar (action (mut foobar)) (hash theme="red") on-initialized=(action runAssert)}}`);

  });



  test('SafeString in, SafeString out (via *-getHtml event handler)', async function(assert) {

    this.set('runAssert', html => {
      assert.ok(isHTMLSafe(html));
    });

    this.set('safestring', htmlSafe('<p>This is safe!</p>'));

    await render(hbs`{{froala-editor content=safestring on-initialized-getHtml=(action runAssert)}}`);

  });



  test('*-getHtml event handler should return a string as the first param', async function(assert) {

    this.set('runAssert', html => {
      assert.ok(typeof html === 'string');
    });

    await render(hbs`{{froala-editor on-initialized-getHtml=(action runAssert)}}`);

  });



  test("component 'method' properly fires the related editors method", async function(assert) {

    let foobar = '<p>Foobar</p>';

    this.set('runAssert', component => {
      component.method('html.get').then( html => {
        assert.equal(html, foobar);
      });
    });

    this.set('foobar', foobar);

    await render(hbs`{{froala-editor content=foobar on-initialized=(action runAssert)}}`);

  });



  test("component 'reinit' method() properly resolves after reinitialized", async function(assert) {

    let reinitCalled = false;

    this.set('runAssert', component => {
      if ( !reinitCalled ) {
        reinitCalled = true;
        component.method('reinit').then(() => {
          assert.ok(true);
        });
      }
    });

    await render(hbs`{{froala-editor on-initialized=(action runAssert)}}`);

  });


  test("delayed '.method()' calls resolve once editor is initialized", async function(assert) {

    let initCalled = false;

    this.set('runAssert', component => {
      if ( !initCalled ) {
        initCalled = true;
        component.destroyEditor();
        component.method('charCounter.count').then(() => {
          assert.ok(true);
        });
        component.initEditor();
      }
    });

    await render(hbs`{{froala-editor on-initialized=(action runAssert)}}`);

  });



  test("'.extend()'ed 'options' are properly applied", async function(assert) {

    this.set('runAssert', component => {
      assert.equal(component.get('_options.theme'), 'red');
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor on-initialized=(action runAssert)}}`);

  });



  test("'.extend()'ed option attributes are properly applied", async function(assert) {
    // Note: This is NOT an ideal strategy when applying default options, use options:{} instead

    this.set('runAssert', component => {
      assert.ok(component.get('_options.charCounterCount') === false);
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor on-initialized=(action runAssert)}}`);

  });



  test("'.extend()'ed 'options' can be overridden by 'options' hash", async function(assert) {

    this.set('runAssert', component => {
      assert.equal(component.get('_options.theme'), 'royal');
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor options=(hash theme="royal") on-initialized=(action runAssert)}}`);

  });



  test("'.extend()'ed 'opitons' can be overridden by attribute options", async function(assert) {

    this.set('runAssert', component => {
      assert.equal(component.get('_options.theme'), 'royal');
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor theme="royal" on-initialized=(action runAssert)}}`);

  });



  test("'.extend()'ed 'options' are not completely overwritten by 'options' hash", async function(assert) {

    this.set('runAssert', component => {
      assert.ok(component.get('_options.toolbarSticky') === false);
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor options=(hash theme="royal") on-initialized=(action runAssert)}}`);

  });



  test("event action added while '.extend()'ing are properly triggered", async function(assert) {

    this.set('triggerContentChanged', component => {
      component.get('editor').events.trigger('contentChanged');
    });

    this.set('runAssert', () => {
      assert.ok(true);
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor on-initialized=(action triggerContentChanged) runAssert=runAssert}}`);

  });



  test("options defined by '.extend()'ing can be overridden by instances separately", async function(assert) {
    assert.expect(2);

    this.set('runAssertA', component => {
      assert.equal(component.get('_options.theme'), 'royal');
    });

    this.set('runAssertB', component => {
      assert.equal(component.get('_options.theme'), 'dark');
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`{{extended-froala-editor options=(hash theme="royal") on-initialized=(action runAssertA)}}{{extended-froala-editor options=(hash theme="dark") on-initialized=(action runAssertB)}}`);

  });



  test("instance options are not shared across all instances", async function(assert) {
    assert.expect(4);

    this.set('runAssertA', component => {
      assert.ok(component.get('_options.disableRightClick'), 'runAssertA disableRightClick');
      assert.notOk(component.get('_options.fontFamilySelection'), 'runAssertA fontFamilySelection');
    });

    this.set('runAssertB', component => {
      assert.notOk(component.get('_options.disableRightClick'), 'runAssertB disableRightClick');
      assert.ok(component.get('_options.fontFamilySelection'), 'runAssertB fontFamilySelection');
    });

    // See tests/dummy/app/components/extended-froala-editor.js
    await render(hbs`
      {{extended-froala-editor options=(hash disableRightClick=true) on-initialized=(action runAssertA)}}
      {{extended-froala-editor options=(hash fontFamilySelection=true) on-initialized=(action runAssertB)}}
    `);

  });


  test("'content' changes while the editor is not initialized update the template instead", async function(assert) {

    let foobar = '<p>Foobar</p>';
    let foobaz = '<p>Foobaz</p>';

    this.set('foo', foobar);

    this.set('runAssert', component => {
      component.destroyEditor();
      this.set('foo', foobaz);
      assert.equal($(component.get('editorSelector'), component.element).html(), foobaz);
    });

    await render(hbs`{{froala-editor content=foo on-initialized=(action runAssert)}}`);

  });


  test("ensure 'html.set' and 'undo.saveStep' triggers the 'contentChanged' event", async function(assert) {

    this.set('setContent', component => {
      component.get('editor').html.set('<p>Foobar</p>');
      component.get('editor').undo.saveStep();
    });

    this.set('runAssert', () => {
      assert.ok(true);
    });

    await render(hbs`{{froala-editor on-initialized=(action setContent) on-contentChanged=(action runAssert)}}`);

  });


});

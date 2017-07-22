import Ember from 'ember';

export default Ember.Test.registerAsyncHelper('fillInFroalaEditor', function(app, selector, html) {
  return fillInFroalaEditor(selector, html);
});

export function fillInFroalaEditor(selector, html) {
  let $editor = find('.froala-editor-instance', selector);
  // SafeString support
  html = (
    html && typeof html.toString === 'function' ?
    html.toString() :
    ''
  );
  Ember.run(() => $editor.froalaEditor('html.set', html));
}

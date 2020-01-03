import FroalaEditor from 'froala-editor';
import { isHTMLSafe } from '@ember/string';
import { registerAsyncHelper } from '@ember/test';
import { find, settled, triggerEvent } from '@ember/test-helpers';

export default registerAsyncHelper('fillInFroalaEditor', function(app, selector, html) {
  fillInFroalaEditor(selector, html);
});

export async function fillInFroalaEditor(selector, html) {

  let element = find(`${selector} .froala-editor-instance`);

  if (element === null) {
    throw `fillInFroalaEditor(): DOM element not found with the selector ${selector}`;
  }

  let editor = FroalaEditor.INSTANCES.find(instance => {
    if (instance['$oel'][0] === element) {
      return instance;
    }
  });

  html = (
    isHTMLSafe(html) ?
    html.toString() :
    html
  );

  if (editor) {
    editor.html.set(html);
    editor.undo.saveStep(); // Triggers contentChange
  } else {
    element.innerHTML = html;
    triggerEvent(element, 'input');
  }

  return settled();

}

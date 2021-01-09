import { isHTMLSafe } from '@ember/template';
import { registerAsyncHelper } from '@ember/test';
import { find, fillIn } from '@ember/test-helpers';

export default registerAsyncHelper(
  'fillInFroalaEditor',
  function (app, selector, html) {
    return fillInFroalaEditor(selector, html);
  }
);

export async function fillInFroalaEditor(selector, html) {
  let element = find(`${selector} [contenteditable]`);

  if (element === null) {
    throw (
      `[contenteditable] DOM element not found within the selector '${selector}'. ` +
      "Try adding 'await settled();' in your test before and after using 'fillInFroalaEditor()'"
    );
  }

  html = isHTMLSafe(html) ? html.toString() : html;

  return fillIn(element, html);
}

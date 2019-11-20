import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';
import { htmlSafe } from '@ember/template';

export function froalaHtml(callback, returnSafeString=true, ...partial) {

  assert(
    '{{froala-html}} helper requires a function as the first parameter',
    typeof callback === 'function'
  );

  return function froalaHtmlClosure(...args) {

    // Editor might be passed in as the first arg if also wrapped with {{froala-arg}}
    // Note: Shift editor off args so it isn't "double passed" when args are spread on the callback
    let editor = (
      typeof args[0] === 'object' && args[0].component ?
      args.shift() :
      this
    );

    assert(
      '{{froala-html}} helper cannot determine the editor instance',
      (editor.html && typeof editor.html.get === 'function')
    );

    // Get the html content from the editor, making it a SafeString if needed
    let html = (returnSafeString ? htmlSafe(editor.html.get()) : editor.html.get());

    // Call the setter, passing in the html first then all others
    return callback(html, editor, ...partial, ...args);
  };

}

export default helper(([callback, ...partial], {returnSafeString=true}) => froalaHtml(callback, returnSafeString, ...partial));

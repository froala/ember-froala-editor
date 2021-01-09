import { registerHelper } from '@ember/test';
import { find } from '@ember/test-helpers';

export default registerHelper('getInFroalaEditor', function (app, selector) {
  return getInFroalaEditor(selector);
});

export function getInFroalaEditor(selector) {
  let element = find(`${selector} [contenteditable]`) || find(selector);

  if (element === null) {
    throw `getInFroalaEditor(): DOM element not found with the selector '${selector}'`;
  }

  return element.innerHTML.trim();
}

import Ember from 'ember';
import Test from 'ember-test';

const { $ } = Ember;

export default function() {
  Test.registerHelper('fillInFroalaEditor', function(_, text, selector = 'body') {
    return fillInFroalaEditor(text, selector);
  });
}

function fillInFroalaEditor(text, selector) {
  $(`${selector} .froala-editor-instance`).froalaEditor('html.set', `<p>${text}</p>`);
  $(`${selector} .froala-editor-instance`).froalaEditor('undo.saveStep');
}

import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | Index');

test('testing aceptance helper', (assert) => {
  visit('/');

  andThen(() => {
    assert.equal(currentURL(), '/');
    assert.equal(find('.froala-editor-instance .fr-element p').text().trim(), '', 'Editor empty on load');
    fillInFroalaEditor('Foobar');
  });

  andThen(() => {
    assert.equal(find('.froala-editor-instance .fr-element p').text().trim(), 'Foobar', 'Correct text entered');
    assert.equal(find('.bound-value').text().trim(), '<p>Foobar</p>', 'Correct value bound');
  });
});

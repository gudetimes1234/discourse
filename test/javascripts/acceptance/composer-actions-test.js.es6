import { acceptance } from 'helpers/qunit-helpers';

acceptance('Composer Actions', {
  loggedIn: true,
  settings: {
    enable_whispers: true
  }
});

QUnit.test('replying to post', async assert => {
  const composerActions = selectKit('.composer-actions');

  visit('/t/internationalization-localization/280');
  click('article#post_3 button.reply');

  await composerActions.expandAwait();

  assert.equal(composerActions.rowByIndex(0).value(), 'reply_as_new_topic');
  assert.equal(composerActions.rowByIndex(1).value(), 'reply_as_private_message');
  assert.equal(composerActions.rowByIndex(2).value(), 'reply_to_topic');
  assert.equal(composerActions.rowByIndex(3).value(), 'toggle_whisper');
  assert.equal(composerActions.rowByIndex(4).value(), undefined);

});

QUnit.test('replying to post - reply_as_private_message', async assert => {
  const composerActions = selectKit('.composer-actions');

  await visit('/t/internationalization-localization/280');
  await click('article#post_3 button.reply');

  await composerActions.expandAwait();
  await composerActions.selectRowByValueAwait('reply_as_private_message');

  assert.equal(find('.users-input .item:eq(0)').text(), 'codinghorror');
  assert.ok(find('.d-editor-input').val().indexOf('Continuing the discussion') >= 0);
});

QUnit.skip('replying to post - reply_to_topic', async assert => {
  const composerActions = selectKit('.composer-actions');

  visit('/t/internationalization-localization/280');
  click('article#post_3 button.reply');
  fillIn('.d-editor-input', 'test replying to topic when initially replied to post');

  await composerActions.expandAwait();
  await composerActions.selectRowByValueAwait('reply_to_topic');

  assert.equal(find('.action-title .topic-link').text().trim(), 'Internationalization / localization');
  assert.equal(find('.action-title .topic-link').attr("href"), '/t/internationalization-localization/280');
  assert.equal(find('.d-editor-input').val(), 'test replying to topic when initially replied to post');
});

QUnit.test('replying to post - toggle_whisper', assert => {
  const composerActions = selectKit('.composer-actions');

  visit('/t/internationalization-localization/280');
  click('article#post_3 button.reply');
  fillIn('.d-editor-input', 'test replying as whisper to topic when initially not a whisper');
  composerActions.expand().selectRowByValue('toggle_whisper');

  andThen(() => {
    assert.ok(
      find('.composer-fields .whisper').text().indexOf(I18n.t("composer.whisper")) > 0
    );
  });
});

QUnit.test('replying to post - reply_as_new_topic', assert => {
  const composerActions = selectKit('.composer-actions');
  const categoryChooser = selectKit('.title-wrapper .category-chooser');
  const categoryChooserReplyArea = selectKit('.reply-area .category-chooser');
  const quote = 'test replying as new topic when initially replied to post';

  visit('/t/internationalization-localization/280');

  click('#topic-title .d-icon-pencil');
  categoryChooser.expand().selectRowByValue(4);
  click('#topic-title .submit-edit');

  click('article#post_3 button.reply');
  fillIn('.d-editor-input', quote);
  composerActions.expand().selectRowByValue('reply_as_new_topic');

  andThen(() => {
    assert.equal(categoryChooserReplyArea.header().name(), 'faq');
    assert.equal(find('.action-title').text().trim(), I18n.t("topic.create_long"));
    assert.ok(find('.d-editor-input').val().includes(quote));
  });
});

QUnit.test('shared draft', assert => {
  let composerActions = selectKit('.composer-actions');

  visit("/");
  click('#create-topic');
  andThen(() => {
    composerActions.expand().selectRowByValue('shared_draft');
  });
  andThen(() => {
    assert.equal(
      find('#reply-control .btn-primary.create .d-button-label').text(),
      I18n.t('composer.create_shared_draft')
    );
    assert.ok(find('#reply-control.composing-shared-draft').length === 1);
  });
});

QUnit.skip('interactions', async assert => {
  const composerActions = selectKit('.composer-actions');
  const quote = 'Life is like riding a bicycle.';

  await visit('/t/internationalization-localization/280');
  await click('article#post_3 button.reply');
  await fillIn('.d-editor-input', quote);

  await composerActions.expandAwait();
  await composerActions.selectRowByValueAwait('reply_to_topic');

  assert.equal(find('.action-title').text().trim(), "Internationalization / localization");
  assert.equal(find('.d-editor-input').val(), quote);

  await composerActions.expandAwait();

  assert.equal(composerActions.rowByIndex(0).value(), 'reply_as_new_topic');
  assert.equal(composerActions.rowByIndex(1).value(), 'reply_to_post');
  assert.equal(composerActions.rowByIndex(2).value(), 'reply_as_private_message');
  assert.equal(composerActions.rowByIndex(3).value(), 'toggle_whisper');
  assert.equal(composerActions.rowByIndex(4).value(), undefined);

  await composerActions.selectRowByValueAwait('reply_to_post');
  await composerActions.expandAwait();

  assert.ok(exists(find('.action-title img.avatar')));
  assert.equal(find('.action-title .user-link').text().trim(), "codinghorror");
  assert.equal(find('.d-editor-input').val(), quote);
  assert.equal(composerActions.rowByIndex(0).value(), 'reply_as_new_topic');
  assert.equal(composerActions.rowByIndex(1).value(), 'reply_as_private_message');
  assert.equal(composerActions.rowByIndex(2).value(), 'reply_to_topic');
  assert.equal(composerActions.rowByIndex(3).value(), 'toggle_whisper');
  assert.equal(composerActions.rowByIndex(4).value(), undefined);

  await composerActions.selectRowByValueAwait('reply_as_new_topic');
  await composerActions.expandAwait();

  assert.equal(find('.action-title').text().trim(), I18n.t("topic.create_long"));
  assert.ok(find('.d-editor-input').val().includes(quote));
  assert.equal(composerActions.rowByIndex(0).value(), 'reply_to_post');
  assert.equal(composerActions.rowByIndex(1).value(), 'reply_as_private_message');
  assert.equal(composerActions.rowByIndex(2).value(), 'reply_to_topic');
  assert.equal(composerActions.rowByIndex(3).value(), 'shared_draft');

  await composerActions.selectRowByValueAwait('reply_as_private_message');
  await composerActions.expandAwait();

  assert.equal(find('.action-title').text().trim(), I18n.t("topic.private_message"));
  assert.ok(find('.d-editor-input').val().indexOf("Continuing the discussion") === 0);
  assert.equal(composerActions.rowByIndex(0).value(), 'reply_as_new_topic');
  assert.equal(composerActions.rowByIndex(1).value(), 'reply_to_post');
  assert.equal(composerActions.rowByIndex(2).value(), 'reply_to_topic');
  assert.equal(composerActions.rowByIndex(3).value(), undefined);
});

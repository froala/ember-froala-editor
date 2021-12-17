import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { assign } from '@ember/polyfills';
import { isHTMLSafe } from '@ember/template';
import { getOwnConfig, macroCondition } from '@embroider/macros';
import Component from '@glimmer/component';
import { froalaArg } from '../helpers/froala-arg';
import { froalaHtml } from '../helpers/froala-html';
import FroalaEditor from 'froala-editor';
import 'froala-editor/css/froala_editor.min.css';

// Import optional language files
if (macroCondition(getOwnConfig().importArLang)) {
  import('froala-editor/js/languages/ar.js');
}
if (macroCondition(getOwnConfig().importBsLang)) {
  import('froala-editor/js/languages/bs.js');
}
if (macroCondition(getOwnConfig().importCsLang)) {
  import('froala-editor/js/languages/cs.js');
}
if (macroCondition(getOwnConfig().importDaLang)) {
  import('froala-editor/js/languages/da.js');
}
if (macroCondition(getOwnConfig().importDeLang)) {
  import('froala-editor/js/languages/de.js');
}
if (macroCondition(getOwnConfig().importElLang)) {
  import('froala-editor/js/languages/el.js');
}
if (macroCondition(getOwnConfig().importEnCaLang)) {
  import('froala-editor/js/languages/en_ca.js');
}
if (macroCondition(getOwnConfig().importEnGbLang)) {
  import('froala-editor/js/languages/en_gb.js');
}
if (macroCondition(getOwnConfig().importEsLang)) {
  import('froala-editor/js/languages/es.js');
}
if (macroCondition(getOwnConfig().importEtLang)) {
  import('froala-editor/js/languages/et.js');
}
if (macroCondition(getOwnConfig().importFaLang)) {
  import('froala-editor/js/languages/fa.js');
}
if (macroCondition(getOwnConfig().importFiLang)) {
  import('froala-editor/js/languages/fi.js');
}
if (macroCondition(getOwnConfig().importFrLang)) {
  import('froala-editor/js/languages/fr.js');
}
if (macroCondition(getOwnConfig().importHeLang)) {
  import('froala-editor/js/languages/he.js');
}
if (macroCondition(getOwnConfig().importHrLang)) {
  import('froala-editor/js/languages/hr.js');
}
if (macroCondition(getOwnConfig().importHuLang)) {
  import('froala-editor/js/languages/hu.js');
}
if (macroCondition(getOwnConfig().importIdLang)) {
  import('froala-editor/js/languages/id.js');
}
if (macroCondition(getOwnConfig().importItLang)) {
  import('froala-editor/js/languages/it.js');
}
if (macroCondition(getOwnConfig().importJaLang)) {
  import('froala-editor/js/languages/ja.js');
}
if (macroCondition(getOwnConfig().importKoLang)) {
  import('froala-editor/js/languages/ko.js');
}
if (macroCondition(getOwnConfig().importKuLang)) {
  import('froala-editor/js/languages/ku.js');
}
if (macroCondition(getOwnConfig().importMeLang)) {
  import('froala-editor/js/languages/me.js');
}
if (macroCondition(getOwnConfig().importNbLang)) {
  import('froala-editor/js/languages/nb.js');
}
if (macroCondition(getOwnConfig().importNlLang)) {
  import('froala-editor/js/languages/nl.js');
}
if (macroCondition(getOwnConfig().importPlLang)) {
  import('froala-editor/js/languages/pl.js');
}
if (macroCondition(getOwnConfig().importPtBrLang)) {
  import('froala-editor/js/languages/pt_br.js');
}
if (macroCondition(getOwnConfig().importPtPtLang)) {
  import('froala-editor/js/languages/pt_pt.js');
}
if (macroCondition(getOwnConfig().importRoLang)) {
  import('froala-editor/js/languages/ro.js');
}
if (macroCondition(getOwnConfig().importRuLang)) {
  import('froala-editor/js/languages/ru.js');
}
if (macroCondition(getOwnConfig().importSkLang)) {
  import('froala-editor/js/languages/sk.js');
}
if (macroCondition(getOwnConfig().importSlLang)) {
  import('froala-editor/js/languages/sl.js');
}
if (macroCondition(getOwnConfig().importSrLang)) {
  import('froala-editor/js/languages/sr.js');
}
if (macroCondition(getOwnConfig().importSvLang)) {
  import('froala-editor/js/languages/sv.js');
}
if (macroCondition(getOwnConfig().importThLang)) {
  import('froala-editor/js/languages/th.js');
}
if (macroCondition(getOwnConfig().importTrLang)) {
  import('froala-editor/js/languages/tr.js');
}
if (macroCondition(getOwnConfig().importUkLang)) {
  import('froala-editor/js/languages/uk.js');
}
if (macroCondition(getOwnConfig().importViLang)) {
  import('froala-editor/js/languages/vi.js');
}
if (macroCondition(getOwnConfig().importZhCnLang)) {
  import('froala-editor/js/languages/zh_cn.js');
}
if (macroCondition(getOwnConfig().importZhTwLang)) {
  import('froala-editor/js/languages/zh_tw.js');
}

// Import optional plugins
if (macroCondition(getOwnConfig().importAlignPlugin)) {
  import('froala-editor/js/plugins/align.min.js');
}
if (macroCondition(getOwnConfig().importCharCounterPlugin)) {
  import('froala-editor/js/plugins/char_counter.min.js');
  import('froala-editor/css/plugins/char_counter.min.css');
}
if (macroCondition(getOwnConfig().importCodeBeautifierPlugin)) {
  import('froala-editor/js/plugins/code_beautifier.min.js');
}
if (macroCondition(getOwnConfig().importCodeViewPlugin)) {
  import('froala-editor/js/plugins/code_view.min.js');
  import('froala-editor/css/plugins/code_view.min.css');
}
if (macroCondition(getOwnConfig().importColorsPlugin)) {
  import('froala-editor/js/plugins/colors.min.js');
  import('froala-editor/css/plugins/colors.min.css');
}
if (macroCondition(getOwnConfig().importDraggablePlugin)) {
  import('froala-editor/js/plugins/draggable.min.js');
  import('froala-editor/css/plugins/draggable.min.css');
}
if (macroCondition(getOwnConfig().importEditInPopupPlugin)) {
  import('froala-editor/js/plugins/edit_in_popup.min.js');
}
if (macroCondition(getOwnConfig().importEmbedlyPlugin)) {
  import('froala-editor/js/third_party/embedly.min.js');
  import('froala-editor/css/third_party/embedly.min.css');
}
if (macroCondition(getOwnConfig().importEmoticonsPlugin)) {
  import('froala-editor/js/plugins/emoticons.min.js');
  import('froala-editor/css/plugins/emoticons.min.css');
}
if (macroCondition(getOwnConfig().importEntitiesPlugin)) {
  import('froala-editor/js/plugins/entities.min.js');
}
if (macroCondition(getOwnConfig().importFilePlugin)) {
  import('froala-editor/js/plugins/file.min.js');
  import('froala-editor/css/plugins/file.min.css');
}
if (macroCondition(getOwnConfig().importFilesManagerPlugin)) {
  import('froala-editor/js/plugins/files_manager.min.js');
  import('froala-editor/css/plugins/files_manager.min.css');
}
if (macroCondition(getOwnConfig().importFontAwesomePlugin)) {
  import('froala-editor/js/third_party/font_awesome.min.js');
  import('froala-editor/css/third_party/font_awesome.min.css');
}
if (macroCondition(getOwnConfig().importFontFamilyPlugin)) {
  import('froala-editor/js/plugins/font_family.min.js');
}
if (macroCondition(getOwnConfig().importFontSizePlugin)) {
  import('froala-editor/js/plugins/font_size.min.js');
}
if (macroCondition(getOwnConfig().importFormsPlugin)) {
  import('froala-editor/js/plugins/forms.min.js');
}
if (macroCondition(getOwnConfig().importFullscreenPlugin)) {
  import('froala-editor/js/plugins/fullscreen.min.js');
  import('froala-editor/css/plugins/fullscreen.min.css');
}
if (macroCondition(getOwnConfig().importHelpPlugin)) {
  import('froala-editor/js/plugins/help.min.js');
  import('froala-editor/css/plugins/help.min.css');
}
if (macroCondition(getOwnConfig().importImagePlugin)) {
  import('froala-editor/js/plugins/image.min.js');
  import('froala-editor/css/plugins/image.min.css');
}
if (macroCondition(getOwnConfig().importImageManagerPlugin)) {
  import('froala-editor/js/plugins/image_manager.min.js');
  import('froala-editor/css/plugins/image_manager.min.css');
}
if (macroCondition(getOwnConfig().importImageTuiPlugin)) {
  import('froala-editor/js/third_party/image_tui.min.js');
  import('froala-editor/css/third_party/image_tui.min.css');
}
if (macroCondition(getOwnConfig().importInlineClassPlugin)) {
  import('froala-editor/js/plugins/inline_class.min.js');
}
if (macroCondition(getOwnConfig().importInlineStylePlugin)) {
  import('froala-editor/js/plugins/inline_style.min.js');
}
if (macroCondition(getOwnConfig().importLineBreakerPlugin)) {
  import('froala-editor/js/plugins/line_breaker.min.js');
  import('froala-editor/css/plugins/line_breaker.min.css');
}
if (macroCondition(getOwnConfig().importLineHeightPlugin)) {
  import('froala-editor/js/plugins/line_height.min.js');
}
if (macroCondition(getOwnConfig().importLinkPlugin)) {
  import('froala-editor/js/plugins/link.min.js');
}
if (macroCondition(getOwnConfig().importListsPlugin)) {
  import('froala-editor/js/plugins/lists.min.js');
}
if (macroCondition(getOwnConfig().importMarkdownPlugin)) {
  import('froala-editor/js/plugins/markdown.min.js');
  import('froala-editor/css/plugins/markdown.min.css');
}
if (macroCondition(getOwnConfig().importParagraphFormatPlugin)) {
  import('froala-editor/js/plugins/paragraph_format.min.js');
}
if (macroCondition(getOwnConfig().importParagraphStylePlugin)) {
  import('froala-editor/js/plugins/paragraph_style.min.js');
}
if (macroCondition(getOwnConfig().importPrintPlugin)) {
  import('froala-editor/js/plugins/print.min.js');
}
if (macroCondition(getOwnConfig().importQuickInsertPlugin)) {
  import('froala-editor/js/plugins/quick_insert.min.js');
  import('froala-editor/css/plugins/quick_insert.min.css');
}
if (macroCondition(getOwnConfig().importQuotePlugin)) {
  import('froala-editor/js/plugins/quote.min.js');
}
if (macroCondition(getOwnConfig().importSavePlugin)) {
  import('froala-editor/js/plugins/save.min.js');
}
if (macroCondition(getOwnConfig().importShowdownPlugin)) {
  import('froala-editor/js/third_party/showdown.min.js');
}
if (macroCondition(getOwnConfig().importSpecialCharactersPlugin)) {
  import('froala-editor/js/plugins/special_characters.min.js');
  import('froala-editor/css/plugins/special_characters.min.css');
}
if (macroCondition(getOwnConfig().importSpellCheckerPlugin)) {
  import('froala-editor/js/third_party/spell_checker.min.js');
  import('froala-editor/css/third_party/spell_checker.min.css');
}
if (macroCondition(getOwnConfig().importTablePlugin)) {
  import('froala-editor/js/plugins/table.min.js');
  import('froala-editor/css/plugins/table.min.css');
}
if (macroCondition(getOwnConfig().importTrackChangesPlugin)) {
  import('froala-editor/js/plugins/track_changes.min.js');
}
if (macroCondition(getOwnConfig().importTrimVideoPlugin)) {
  import('froala-editor/js/plugins/trim_video.min.js');
  import('froala-editor/css/plugins/trim_video.min.css');
}
if (macroCondition(getOwnConfig().importUrlPlugin)) {
  import('froala-editor/js/plugins/url.min.js');
}
if (macroCondition(getOwnConfig().importVideoPlugin)) {
  import('froala-editor/js/plugins/video.min.js');
  import('froala-editor/css/plugins/video.min.css');
}
if (macroCondition(getOwnConfig().importWordPastePlugin)) {
  import('froala-editor/js/plugins/word_paste.min.js');
}

// Import optional themes
if (macroCondition(getOwnConfig().importDarkTheme)) {
  import('froala-editor/css/themes/dark.min.css');
}
if (macroCondition(getOwnConfig().importGrayTheme)) {
  import('froala-editor/css/themes/gray.min.css');
}
if (macroCondition(getOwnConfig().importRoyalTheme)) {
  import('froala-editor/css/themes/royal.min.css');
}

// Re-export FroalaEditor so those who extend the component
// can also access the FroalaEditor class at the same time
export { FroalaEditor };

export default class FroalaEditorComponent extends Component {
  options = {};

  editor = null;

  get update() {
    return this.args.update;
  }

  get updateEvent() {
    return this.args.updateEvent || 'contentChanged';
  }

  get fastboot() {
    return getOwner(this).lookup('service:fastboot');
  }

  get propertyOptions() {
    let options = {};
    for (let propertyName in this) {
      if (
        Object.prototype.hasOwnProperty.call(
          FroalaEditor.DEFAULTS,
          propertyName
        )
      ) {
        options[propertyName] = this[propertyName];
      }
    }
    return options;
  }

  get argumentOptions() {
    let options = {};
    for (let argumentName in this.args) {
      if (
        Object.prototype.hasOwnProperty.call(
          FroalaEditor.DEFAULTS,
          argumentName
        )
      ) {
        options[argumentName] = this.args[argumentName];
      }
    }
    return options;
  }

  get propertyCallbacks() {
    let callbacks = {};

    // Regex's used for replacing things in the name
    const regexOnPrefix = /^on-/g;
    const regexHyphens = /-/g;
    const regexDots = /\./g;

    // Class methods are not available in a `for (name in this)` loop
    let propertyNames = Object.getOwnPropertyNames(this.__proto__);

    for (let propertyName of propertyNames) {
      // Only names that start with on- are callbacks
      if (propertyName.indexOf('on-') !== 0) {
        continue;
      }

      assert(
        `<FroalaEditor> ${propertyName} event callback property must be a function`,
        typeof this[propertyName] === 'function'
      );

      // Convert the name to what the event name would be
      let eventName = propertyName;
      eventName = eventName.replace(regexOnPrefix, '');
      eventName = eventName.replace(regexHyphens, '.');

      // Special use case for the 'popups.hide.[id]' event
      // Ember usage would be '@on-popups-hide-id=(fn)'
      // https://www.froala.com/wysiwyg-editor/docs/events#popups.show.[id]
      if (eventName.indexOf('popups.hide.') === 0) {
        let id = eventName.replace('popups.hide.', '');
        id = id.replace(regexDots, '-'); // Convert back to hyphens
        eventName = `popups.hide.[${id}]`;
      }

      // Wrap the callback to pass the editor in as the first argument
      callbacks[eventName] = this[propertyName];
    }

    return callbacks;
  }

  get argumentCallbacks() {
    let callbacks = {};

    // Regex's used for replacing things in the name
    const regexOnPrefix = /^on-/g;
    const regexHyphens = /-/g;
    const regexDots = /\./g;

    for (let argumentName in this.args) {
      // Only names that start with on- are callbacks
      if (argumentName.indexOf('on-') !== 0) {
        continue;
      }

      assert(
        `<FroalaEditor> @${argumentName} event callback argument must be a function`,
        typeof this.args[argumentName] === 'function'
      );

      // Convert the name to what the event name would be
      let eventName = argumentName;
      eventName = eventName.replace(regexOnPrefix, '');
      eventName = eventName.replace(regexHyphens, '.');

      // Special use case for the 'popups.hide.[id]' event
      // Ember usage would be '@on-popups-hide-id=(fn)'
      // https://www.froala.com/wysiwyg-editor/docs/events#popups.show.[id]
      if (eventName.indexOf('popups.hide.') === 0) {
        let id = eventName.replace('popups.hide.', '');
        id = id.replace(regexDots, '-'); // Convert back to hyphens
        eventName = `popups.hide.[${id}]`;
      }

      // Wrap the callback to pass the editor in as the first argument
      callbacks[eventName] = this.args[argumentName];
    }

    return callbacks;
  }

  get combinedOptions() {
    let config = getOwner(this).resolveRegistration('config:environment');
    return assign(
      {},
      config['ember-froala-editor'],
      this.options,
      this.propertyOptions,
      this.args.options,
      this.argumentOptions
    );
  }

  get combinedCallbacks() {
    return assign({}, this.propertyCallbacks, this.argumentCallbacks);
  }

  get optionsWithInitEvent() {
    let options = this.combinedOptions;

    // Determine which event will be called first
    let initEventName = options.initOnClick
      ? 'initializationDelayed'
      : 'initialized';

    // Ensure the events object exists
    options.events = options.events || {};

    // Grab the current init callback before overriding
    let initEventCallback = options.events[initEventName];

    // Add the created callback to the proper initialization event
    options.events[initEventName] = froalaArg(
      this.setupEditor,
      initEventName,
      initEventCallback
    );

    return options;
  }

  constructor(owner, args) {
    super(owner, args);
    assert(
      '<FroalaEditor> @content argument must be a SafeString from htmlSafe()',
      isHTMLSafe(args.content) ||
        args.content === null ||
        typeof args.content === 'undefined'
    );
    assert(
      '<FroalaEditor> @update argument must be a function',
      typeof args.update === 'function' || typeof args.update === 'undefined'
    );
    assert(
      '<FroalaEditor> @updateEvent argument must be a string',
      typeof args.updateEvent === 'string' ||
        typeof args.updateEvent === 'undefined'
    );
    assert(
      '<FroalaEditor> @options argument must be an object',
      typeof args.options === 'object' || typeof args.options === 'undefined'
    );
  }

  @action createEditor(element, [options]) {
    new FroalaEditor(element, options);
  }

  @action setupEditor(editor, initEventName, initEventCallback, ...args) {
    // Add a reference to each other so they accessible from either
    editor.component = this;
    this.editor = editor;

    // Handle the initial @disabled state
    // Note: Run before the event callbacks are added,
    //       so the @on-edit-off callback isn't triggered
    if (this.args.disabled) {
      this.editor.edit.off();
    }

    // Call the combinedCallbacks getter once
    let callbacks = this.combinedCallbacks;

    // Add event handler callbacks, passing in the editor as the first arg
    for (let eventName in callbacks) {
      this.editor.events.on(eventName, froalaArg(callbacks[eventName]));
    }

    // Add update callback when a setter is passed in
    if (this.update) {
      this.editor.events.on(this.updateEvent, froalaHtml(this.update), true); // true = run first
    }

    // Add destroyed callback so the editor can be unreferenced
    this.editor.events.on('destroy', froalaArg(this.teardownEditor), false); // false = run last

    // Since we overrode this event callback,
    // call the passed in callback(s) if there are any
    if (initEventCallback === 'function') {
      // Mimic default behavior by binding the editor instance to the called context
      initEventCallback.bind(editor)(...args);
    }
    if (typeof callbacks[initEventName] === 'function') {
      // Mimic a typical on-* callback by passing in the editor as the first arg
      callbacks[initEventName](editor, ...args);
    }
  }

  @action updateEditorContent(element, [content]) {
    assert(
      '<FroalaEditor> updated @content argument must be a SafeString from htmlSafe()',
      isHTMLSafe(content) || content === null || typeof content === 'undefined'
    );

    // content should be undefined or a SafeString
    let html = isHTMLSafe(content) ? content.toString() : '';

    // When the editor is available,
    // updates should go through `editor.html.set()`
    if (this.editor) {
      // Avoid recursive loop, check for changed content
      if (this.editor.html.get() !== html) {
        this.editor.html.set(html);
      }

      // When the editor is NOT available,
      // updates should go through the DOM (directly)
    } else {
      // Avoid recursive loop, check for changed content
      if (element.innerHTML !== html) {
        element.innerHTML = html;
      }
    }
  }

  @action updateDisabledState(element, [disabled]) {
    // Ignore when the editor is not available
    if (!this.editor) {
      return;
    }

    // Change the editor to the appropriate state
    if (disabled && !this.editor.edit.isDisabled()) {
      this.editor.edit.off();
    } else if (!disabled && this.editor.edit.isDisabled()) {
      this.editor.edit.on();
    }
  }

  @action destroyEditor(/*element*/) {
    // Guard against someone calling editor.destroy()
    // from an event callback, which teardownEditor()
    // would still trigger and unreference the editor
    // before this callback had a chance to run
    if (this.editor) {
      this.editor.destroy();
    }
  }

  @action teardownEditor(editor /*, ...args*/) {
    delete editor.component;
    this.editor = null;
  }
}

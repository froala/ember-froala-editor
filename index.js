'use strict';

const VersionChecker = require('ember-cli-version-checker');

// Addon build option defaults
const defaultOptions = {
  languages: [],
  plugins: [],
  themes: [],
};

// Lists of assets to validate options against
const validOptions = {
  languages: [
    'ar',
    'bs',
    'cs',
    'da',
    'de',
    'el',
    'en_ca',
    'en_gb',
    'es',
    'et',
    'fa',
    'fi',
    'fr',
    'he',
    'hr',
    'hu',
    'id',
    'it',
    'ja',
    'ko',
    'ku',
    'me',
    'nb',
    'nl',
    'pl',
    'pt_br',
    'pt_pt',
    'ro',
    'ru',
    'sk',
    'sl',
    'sr',
    'sv',
    'th',
    'tr',
    'uk',
    'vi',
    'zh_cn',
    'zh_tw',
  ],
  plugins: [
    'align',
    'char_counter',
    'code_beautifier',
    'code_view',
    'colors',
    'draggable',
    'edit_in_popup',
    'embedly',
    'emoticons',
    'entities',
    'file',
    'files_manager',
    'font_awesome',
    'font_family',
    'font_size',
    'forms',
    'fullscreen',
    'help',
    'image',
    'image_manager',
    'image_tui',
    'inline_class',
    'inline_style',
    'line_breaker',
    'line_height',
    'link',
    'lists',
    'markdown',
    'paragraph_format',
    'paragraph_style',
    'print',
    'quick_insert',
    'quote',
    'save',
    'showdown',
    'special_characters',
    'spell_checker',
    'table',
    'track_changes',
    'trim_video',
    'url',
    'video',
    'word_paste',
  ],
  themes: ['dark', 'gray', 'royal'],
};

module.exports = {
  name: require('./package').name,

  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },

    autoImport: {
      skipBabel: [
        {
          package: 'froala-editor',
          semverRange: '*',
        },
      ],
    },

    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },

    // 'ember-froala-editor': {
    //   languages: [],
    //   plugins: [],
    //   themes: [],
    // },
  },

  init() {
    this._super.init.apply(this, arguments);
    let checker = new VersionChecker(this.project);
    checker
      .for('ember-cli')
      .assertAbove(
        '3.19.0',
        `${this.name}: Minimum ember-cli version is 3.20.0`
      );
    checker
      .for('ember-source')
      .assertAbove(
        '3.19.0',
        `${this.name}: Minimum ember.js version is 3.20.0`
      );
  }, // init()

  included(app) {
    // https://ember-cli.com/api/classes/addon#method_included
    this._super.included.apply(this, arguments);

    // For nested usage, build the options up through the entire tree,
    // with priority going up the tree and the "root" app always overriding
    let appOptions = {};
    let current = this;
    do {
      app = current.app || app;
      if (app.options && app.options[this.name]) {
        appOptions = Object.assign(appOptions, app.options[this.name]);
      }
    } while (current.parent.parent && (current = current.parent));

    // Build options by merging default options
    // with the apps ember-cli-build.js options
    let options = Object.assign({}, defaultOptions, appOptions);

    // Transpose booleans and strings into array
    ['languages', 'plugins', 'themes'].forEach((type) => {
      if (Array.isArray(options[type])) {
        // Good!
      } else if (typeof options[type] === 'string') {
        options[type] = [options[type]];
      } else if (typeof options[type] === 'boolean') {
        options[type] = options[type] ? validOptions[type] : [];
      } else {
        throw new Error(
          `${this.name}: ${type} ` +
            'option in ember-cli-build.js is an invalid type, ' +
            'ensure it is either a boolean (all or none), ' +
            'string (just one), or array (specific list)'
        );
      }
    });

    // Replace plugin "names" with filenames
    options.plugins = options.plugins.map((plugin) => {
      switch (plugin) {
        /* eslint-disable prettier/prettier */
        case 'charCounter': return 'char_counter';
        case 'codeBeautifier': return 'code_beautifier';
        case 'codeView': return 'code_view';
        case 'editInPopup': return 'edit_in_popup';
        case 'filesManager': return 'files_manager';
        case 'fontAwesome': return 'font_awesome';
        case 'fontFamily': return 'font_family';
        case 'fontSize': return 'font_size';
        case 'imageManager': return 'image_manager';
        case 'imageTUI': return 'image_tui';
        case 'inlineClass': return 'inline_class';
        case 'inlineStyle': return 'inline_style';
        case 'lineBreaker': return 'line_breaker';
        case 'lineHeight': return 'line_height';
        case 'paragraphFormat': return 'paragraph_format';
        case 'paragraphStyle': return 'paragraph_style';
        case 'quickInsert': return 'quick_insert';
        case 'specialCharacters': return 'special_characters';
        case 'spellChecker': return 'spell_checker';
        case 'trackChanges': return 'track_changes';
        case 'trimVideo': return 'trim_video';
        case 'wordPaste': return 'word_paste';
        default: return plugin;
        /* eslint-enable prettier/prettier */
      }
    }); // options.plugins.map()

    // Validate options to ensure that all assets are valid
    ['languages', 'plugins', 'themes'].forEach((type) => {
      options[type].forEach((asset) => {
        if (!validOptions[type].includes(asset)) {
          throw new Error(
            `${this.name}: "${asset}" is an invalid option for ${type}.`
          );
        }
      });
    });

    // Breakout each asset to be imported into a separate macro condition,
    // macro conditions do not support "dynamic" `includes()` checking...
    this.options['@embroider/macros'].setOwnConfig = {
      // Language assets
      importArLang: options.languages.includes('ar'),
      importBsLang: options.languages.includes('bs'),
      importCsLang: options.languages.includes('cs'),
      importDaLang: options.languages.includes('da'),
      importDeLang: options.languages.includes('de'),
      importElLang: options.languages.includes('el'),
      importEnCaLang: options.languages.includes('en_ca'),
      importEnGbLang: options.languages.includes('en_gb'),
      importEsLang: options.languages.includes('es'),
      importEtLang: options.languages.includes('et'),
      importFaLang: options.languages.includes('fa'),
      importFiLang: options.languages.includes('fi'),
      importFrLang: options.languages.includes('fr'),
      importHeLang: options.languages.includes('he'),
      importHrLang: options.languages.includes('hr'),
      importHuLang: options.languages.includes('hu'),
      importIdLang: options.languages.includes('id'),
      importItLang: options.languages.includes('it'),
      importJaLang: options.languages.includes('ja'),
      importKoLang: options.languages.includes('ko'),
      importKuLang: options.languages.includes('ku'),
      importMeLang: options.languages.includes('me'),
      importNbLang: options.languages.includes('nb'),
      importNlLang: options.languages.includes('nl'),
      importPlLang: options.languages.includes('pl'),
      importPtBrLang: options.languages.includes('pt_br'),
      importPtPtLang: options.languages.includes('pt_pt'),
      importRoLang: options.languages.includes('ro'),
      importRuLang: options.languages.includes('ru'),
      importSkLang: options.languages.includes('sk'),
      importSlLang: options.languages.includes('sl'),
      importSrLang: options.languages.includes('sr'),
      importSvLang: options.languages.includes('sv'),
      importThLang: options.languages.includes('th'),
      importTrLang: options.languages.includes('tr'),
      importUkLang: options.languages.includes('uk'),
      importViLang: options.languages.includes('vi'),
      importZhCnLang: options.languages.includes('zh_cn'),
      importZhTwLang: options.languages.includes('zh_tw'),

      // Plugin assets
      importAlignPlugin: true,
      importCharCounterPlugin: options.plugins.includes('char_counter'),
      importCodeBeautifierPlugin: options.plugins.includes('code_beautifier'),
      importCodeViewPlugin: options.plugins.includes('code_view'),
      importColorsPlugin: options.plugins.includes('colors'),
      importDraggablePlugin: options.plugins.includes('draggable'),
      importEditInPopupPlugin: options.plugins.includes('edit_in_popup'),
      importEmbedlyPlugin: options.plugins.includes('embedly'),
      importEmoticonsPlugin: options.plugins.includes('emoticons'),
      importEntitiesPlugin: options.plugins.includes('entities'),
      importFilePlugin: options.plugins.includes('file'),
      importFilesManagerPlugin: options.plugins.includes('files_manager'),
      importFontAwesomePlugin: options.plugins.includes('font_awesome'),
      importFontFamilyPlugin: options.plugins.includes('font_family'),
      importFontSizePlugin: options.plugins.includes('font_size'),
      importFormsPlugin: options.plugins.includes('forms'),
      importFullscreenPlugin: options.plugins.includes('fullscreen'),
      importHelpPlugin: options.plugins.includes('help'),
      importImagePlugin: options.plugins.includes('image'),
      importImageManagerPlugin: options.plugins.includes('image_manager'),
      importImageTuiPlugin: options.plugins.includes('image_tui'),
      importInlineClassPlugin: options.plugins.includes('inline_class'),
      importInlineStylePlugin: options.plugins.includes('inline_style'),
      importLineBreakerPlugin: options.plugins.includes('line_breaker'),
      importLineHeightPlugin: options.plugins.includes('line_height'),
      importLinkPlugin: options.plugins.includes('link'),
      importListsPlugin: options.plugins.includes('lists'),
      importMarkdownPlugin: options.plugins.includes('markdown'),
      importParagraphFormatPlugin: options.plugins.includes('paragraph_format'),
      importParagraphStylePlugin: options.plugins.includes('paragraph_style'),
      importPrintPlugin: options.plugins.includes('print'),
      importQuickInsertPlugin: options.plugins.includes('quick_insert'),
      importQuotePlugin: options.plugins.includes('quote'),
      importSavePlugin: options.plugins.includes('save'),
      importShowdownPlugin: options.plugins.includes('showdown'),
      importSpecialCharactersPlugin:
        options.plugins.includes('special_characters'),
      importSpellCheckerPlugin: options.plugins.includes('spell_checker'),
      importTablePlugin: options.plugins.includes('table'),
      importTrackChangesPlugin: options.plugins.includes('track_changes'),
      importTrimVideoPlugin: options.plugins.includes('trim_video'),
      importUrlPlugin: options.plugins.includes('url'),
      importVideoPlugin: options.plugins.includes('video'),
      importWordPastePlugin: options.plugins.includes('word_paste'),

      // Theme assets
      importDarkTheme: options.themes.includes('dark'),
      importGrayTheme: options.themes.includes('gray'),
      importRoyalTheme: options.themes.includes('royal'),
    }; // this.options['@embroider/macros'].setOwnConfig
  }, // included()
}; // module.exports

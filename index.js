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
    /* eslint-disable prettier/prettier */
    
    // Language assets
    this.options['@embroider/macros'].setOwnConfig.importArLang = options.languages.includes('ar');
    this.options['@embroider/macros'].setOwnConfig.importBsLang = options.languages.includes('bs');
    this.options['@embroider/macros'].setOwnConfig.importCsLang = options.languages.includes('cs');
    this.options['@embroider/macros'].setOwnConfig.importDaLang = options.languages.includes('da');
    this.options['@embroider/macros'].setOwnConfig.importDeLang = options.languages.includes('de');
    this.options['@embroider/macros'].setOwnConfig.importElLang = options.languages.includes('el');
    this.options['@embroider/macros'].setOwnConfig.importEnCaLang = options.languages.includes('en_ca');
    this.options['@embroider/macros'].setOwnConfig.importEnGbLang = options.languages.includes('en_gb');
    this.options['@embroider/macros'].setOwnConfig.importEsLang = options.languages.includes('es');
    this.options['@embroider/macros'].setOwnConfig.importEtLang = options.languages.includes('et');
    this.options['@embroider/macros'].setOwnConfig.importFaLang = options.languages.includes('fa');
    this.options['@embroider/macros'].setOwnConfig.importFiLang = options.languages.includes('fi');
    this.options['@embroider/macros'].setOwnConfig.importFrLang = options.languages.includes('fr');
    this.options['@embroider/macros'].setOwnConfig.importHeLang = options.languages.includes('he');
    this.options['@embroider/macros'].setOwnConfig.importHrLang = options.languages.includes('hr');
    this.options['@embroider/macros'].setOwnConfig.importHuLang = options.languages.includes('hu');
    this.options['@embroider/macros'].setOwnConfig.importIdLang = options.languages.includes('id');
    this.options['@embroider/macros'].setOwnConfig.importItLang = options.languages.includes('it');
    this.options['@embroider/macros'].setOwnConfig.importJaLang = options.languages.includes('ja');
    this.options['@embroider/macros'].setOwnConfig.importKoLang = options.languages.includes('ko');
    this.options['@embroider/macros'].setOwnConfig.importKuLang = options.languages.includes('ku');
    this.options['@embroider/macros'].setOwnConfig.importMeLang = options.languages.includes('me');
    this.options['@embroider/macros'].setOwnConfig.importNbLang = options.languages.includes('nb');
    this.options['@embroider/macros'].setOwnConfig.importNlLang = options.languages.includes('nl');
    this.options['@embroider/macros'].setOwnConfig.importPlLang = options.languages.includes('pl');
    this.options['@embroider/macros'].setOwnConfig.importPtBrLang = options.languages.includes('pt_br');
    this.options['@embroider/macros'].setOwnConfig.importPtPtLang = options.languages.includes('pt_pt');
    this.options['@embroider/macros'].setOwnConfig.importRoLang = options.languages.includes('ro');
    this.options['@embroider/macros'].setOwnConfig.importRuLang = options.languages.includes('ru');
    this.options['@embroider/macros'].setOwnConfig.importSkLang = options.languages.includes('sk');
    this.options['@embroider/macros'].setOwnConfig.importSlLang = options.languages.includes('sl');
    this.options['@embroider/macros'].setOwnConfig.importSrLang = options.languages.includes('sr');
    this.options['@embroider/macros'].setOwnConfig.importSvLang = options.languages.includes('sv');
    this.options['@embroider/macros'].setOwnConfig.importThLang = options.languages.includes('th');
    this.options['@embroider/macros'].setOwnConfig.importTrLang = options.languages.includes('tr');
    this.options['@embroider/macros'].setOwnConfig.importUkLang = options.languages.includes('uk');
    this.options['@embroider/macros'].setOwnConfig.importViLang = options.languages.includes('vi');
    this.options['@embroider/macros'].setOwnConfig.importZhCnLang = options.languages.includes('zh_cn');
    this.options['@embroider/macros'].setOwnConfig.importZhTwLang = options.languages.includes('zh_tw');

    // Plugin assets
    this.options['@embroider/macros'].setOwnConfig.importAlignPlugin = options.plugins.includes('align');
    this.options['@embroider/macros'].setOwnConfig.importCharCounterPlugin = options.plugins.includes('char_counter');
    this.options['@embroider/macros'].setOwnConfig.importCodeBeautifierPlugin = options.plugins.includes('code_beautifier');
    this.options['@embroider/macros'].setOwnConfig.importCodeViewPlugin = options.plugins.includes('code_view');
    this.options['@embroider/macros'].setOwnConfig.importColorsPlugin = options.plugins.includes('colors');
    this.options['@embroider/macros'].setOwnConfig.importDraggablePlugin = options.plugins.includes('draggable');
    this.options['@embroider/macros'].setOwnConfig.importEditInPopupPlugin = options.plugins.includes('edit_in_popup');
    this.options['@embroider/macros'].setOwnConfig.importEmbedlyPlugin = options.plugins.includes('embedly');
    this.options['@embroider/macros'].setOwnConfig.importEmoticonsPlugin = options.plugins.includes('emoticons');
    this.options['@embroider/macros'].setOwnConfig.importEntitiesPlugin = options.plugins.includes('entities');
    this.options['@embroider/macros'].setOwnConfig.importFilePlugin = options.plugins.includes('file');
    this.options['@embroider/macros'].setOwnConfig.importFilesManagerPlugin = options.plugins.includes('files_manager');
    this.options['@embroider/macros'].setOwnConfig.importFontAwesomePlugin = options.plugins.includes('font_awesome');
    this.options['@embroider/macros'].setOwnConfig.importFontFamilyPlugin = options.plugins.includes('font_family');
    this.options['@embroider/macros'].setOwnConfig.importFontSizePlugin = options.plugins.includes('font_size');
    this.options['@embroider/macros'].setOwnConfig.importFormsPlugin = options.plugins.includes('forms');
    this.options['@embroider/macros'].setOwnConfig.importFullscreenPlugin = options.plugins.includes('fullscreen');
    this.options['@embroider/macros'].setOwnConfig.importHelpPlugin = options.plugins.includes('help');
    this.options['@embroider/macros'].setOwnConfig.importImagePlugin = options.plugins.includes('image');
    this.options['@embroider/macros'].setOwnConfig.importImageManagerPlugin = options.plugins.includes('image_manager');
    this.options['@embroider/macros'].setOwnConfig.importImageTuiPlugin = options.plugins.includes('image_tui');
    this.options['@embroider/macros'].setOwnConfig.importInlineClassPlugin = options.plugins.includes('inline_class');
    this.options['@embroider/macros'].setOwnConfig.importInlineStylePlugin = options.plugins.includes('inline_style');
    this.options['@embroider/macros'].setOwnConfig.importLineBreakerPlugin = options.plugins.includes('line_breaker');
    this.options['@embroider/macros'].setOwnConfig.importLineHeightPlugin = options.plugins.includes('line_height');
    this.options['@embroider/macros'].setOwnConfig.importLinkPlugin = options.plugins.includes('link');
    this.options['@embroider/macros'].setOwnConfig.importListsPlugin = options.plugins.includes('lists');
    this.options['@embroider/macros'].setOwnConfig.importMarkdownPlugin = options.plugins.includes('markdown');
    this.options['@embroider/macros'].setOwnConfig.importParagraphFormatPlugin = options.plugins.includes('paragraph_format');
    this.options['@embroider/macros'].setOwnConfig.importParagraphStylePlugin = options.plugins.includes('paragraph_style');
    this.options['@embroider/macros'].setOwnConfig.importPrintPlugin = options.plugins.includes('print');
    this.options['@embroider/macros'].setOwnConfig.importQuickInsertPlugin = options.plugins.includes('quick_insert');
    this.options['@embroider/macros'].setOwnConfig.importQuotePlugin = options.plugins.includes('quote');
    this.options['@embroider/macros'].setOwnConfig.importSavePlugin = options.plugins.includes('save');
    this.options['@embroider/macros'].setOwnConfig.importShowdownPlugin = options.plugins.includes('showdown');
    this.options['@embroider/macros'].setOwnConfig.importSpecialCharactersPlugin = options.plugins.includes('special_characters');
    this.options['@embroider/macros'].setOwnConfig.importSpellCheckerPlugin = options.plugins.includes('spell_checker');
    this.options['@embroider/macros'].setOwnConfig.importTablePlugin = options.plugins.includes('table');
    this.options['@embroider/macros'].setOwnConfig.importTrackChangesPlugin = options.plugins.includes('track_changes');
    this.options['@embroider/macros'].setOwnConfig.importTrimVideoPlugin = options.plugins.includes('trim_video');
    this.options['@embroider/macros'].setOwnConfig.importUrlPlugin = options.plugins.includes('url');
    this.options['@embroider/macros'].setOwnConfig.importVideoPlugin = options.plugins.includes('video');
    this.options['@embroider/macros'].setOwnConfig.importWordPastePlugin = options.plugins.includes('word_paste');

    // Theme assets
    this.options['@embroider/macros'].setOwnConfig.importDarkTheme = options.themes.includes('dark');
    this.options['@embroider/macros'].setOwnConfig.importGrayTheme = options.themes.includes('gray');
    this.options['@embroider/macros'].setOwnConfig.importRoyalTheme = options.themes.includes('royal');

    /* eslint-enable prettier/prettier */
  }, // included()
}; // module.exports

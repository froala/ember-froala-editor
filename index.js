'use strict';

// Module requirements
const fs = require('fs');
const path = require('path');

module.exports = {
  name: require('./package').name,

  options: {
    '@embroider/macros': {
      setOwnConfig: {
        languages: [],
        plugins: { css: [], js: [] },
        third_party: { css: [], js: [] },
        themes: [],
      },
    },

    autoImport: {
      skipBabel: [
        {
          package: 'froala-editor',
          semverRange: '*',
        },
      ],
      webpack: {
        resolve: {
          fallback: {
            // https://github.com/froala/wysiwyg-editor/issues/4156
            crypto: false,
          },
        },
      },
    },

    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')],
    },

    'ember-froala-editor': {
      languages: [],
      plugins: [],
      themes: [],
    },
  },

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
    let options = Object.assign(this.options[this.name], appOptions);

    // Ensure the addon options are arrays
    ['languages', 'plugins', 'themes'].forEach((type) => {
      if (!Array.isArray(options[type])) {
        throw new Error(
          `${this.name}: ${type} ` +
            'option in ember-cli-build.js must be an array. ' +
            'Boolean and string values have been depreciated.'
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
    });

    // Paths to use for validating optional assets
    let froalaPath = path.dirname(
      require.resolve('froala-editor/package.json')
    );
    let languagePath = path.join(froalaPath, 'js', 'languages');
    let pluginJsPath = path.join(froalaPath, 'js', 'plugins');
    let pluginCssPath = path.join(froalaPath, 'css', 'plugins');
    let thirdPartyJsPath = path.join(froalaPath, 'js', 'third_party');
    let thirdPartyCssPath = path.join(froalaPath, 'css', 'third_party');
    let themePath = path.join(froalaPath, 'css', 'themes');

    // Validate language options and add to proper import list
    options.languages.forEach((language) => {
      let filename = language + '.js';
      if (fs.existsSync(path.join(languagePath, filename))) {
        this.options['@embroider/macros'].setOwnConfig.languages.push(filename);
      } else {
        throw new Error(
          `${this.name}: languages "${language}" is not available.`
        );
      }
    });

    // Validate plugin options and add to proper import list(s)
    options.plugins.forEach((plugin) => {
      let jsFilename = plugin + '.min.js';
      let cssFilename = plugin + '.min.css';
      if (fs.existsSync(path.join(pluginJsPath, jsFilename))) {
        this.options['@embroider/macros'].setOwnConfig.plugins.js.push(
          jsFilename
        );
        if (fs.existsSync(path.join(pluginCssPath, cssFilename))) {
          this.options['@embroider/macros'].setOwnConfig.plugins.css.push(
            cssFilename
          );
        }
      } else if (fs.existsSync(path.join(thirdPartyJsPath, jsFilename))) {
        this.options['@embroider/macros'].setOwnConfig.third_party.js.push(
          jsFilename
        );
        if (fs.existsSync(path.join(thirdPartyCssPath, cssFilename))) {
          this.options['@embroider/macros'].setOwnConfig.third_party.css.push(
            cssFilename
          );
        }
      } else {
        throw new Error(`${this.name}: plugins "${plugin}" is not available.`);
      }
    });

    // Validate theme options and add to proper import list
    options.themes.forEach((theme) => {
      let filename = theme + '.min.css';
      if (fs.existsSync(path.join(themePath, filename))) {
        this.options['@embroider/macros'].setOwnConfig.themes.push(filename);
      } else {
        throw new Error(`${this.name}: themes "${theme}" is not available.`);
      }
    });
  },
};

'use strict';


// Module requirements
var fs             = require('fs');
var path           = require('path');
var VersionChecker = require('ember-cli-version-checker');


// Resolve the froala-editor node path once..
var froalaPath = path.dirname(
  require.resolve( 'froala-editor/package.json' )
);


module.exports = {
  name: 'ember-froala-editor',


  // Addon build option defaults
  defaultOptions: {
    languages : false,
    plugins   : false,
    themes    : false
  },


  // https://github.com/ember-cli/ember-cli-version-checker#forember
  init() {
    this._super.init.apply( this, arguments );
    let checker = new VersionChecker( this );
    checker.for('ember-cli').assertAbove(
      '2.15.0',
      'To use ember-froala-editor you must have ember-cli 2.15.0 or later!'
    ); // https://emberjs.com/blog/2017/09/01/ember-2-15-released.html#toc_app-import-files-within-node_modules
    checker.forEmber().assertAbove(
      '2.15.0',
      'To use ember-froala-editor you must have ember 2.15.0 or later!'
    ); // https://emberjs.com/blog/2017/09/01/ember-2-15-released.html#toc_public-router-service-phase-1
  }, // init()


  included( app ) {


    // https://ember-cli.com/extending/#addon-entry-point
    this._super.included.apply( this, arguments );


    // Do not import anything if in "fastboot mode"
    if ( typeof FastBoot !== 'undefined' ) {
      return;
    }


    // Get the application specific configuration options
    let appOptions = ( app.options && app.options[ this.name ] ) || {};


    // Plugins default has recently changed, warn users
    if ( !appOptions.hasOwnProperty('plugins') ) {
      this.ui.writeDeprecateLine(
        `${this.name}: The default value for the 'plugins' option has change from 'true' to 'false'. ` +
        `Please update '${this.name}.plugins' in 'ember-cli-build.js' to indicate which plugin(s) you need; ` +
        'string = one plugin name, array = multiple plugin names, true = all plugins, false = no plugins.'
      );
    }


    // Build options by merging default options
    // with the apps ember-cli-build.js options
    let options = Object.assign(
      {},
      this.defaultOptions,
      appOptions
    );


    // When importing files, import from node_modules
    let nodePath = path.join( 'node_modules', 'froala-editor');


    // Import the base Froala Editor files
    this.import( path.join( nodePath, 'js', 'froala_editor.min.js' ) );
    this.import( path.join( nodePath, 'css', 'froala_editor.css' ) );
    this.import( path.join( nodePath, 'css', 'froala_style.css' ) );


    // Bucket for import list / details
    let additionalAssets = [];


    // Import the other Froala Editor files (when requested)
    if ( options.plugins && options.plugins !== [] ) {
      additionalAssets.push({
        label     : 'Plugin(s)',
        paths     : [path.join( 'js', 'plugins' ), path.join( 'js', 'third_party' )],
        files     : options.plugins,
        extension : '.min.js'
      });
      additionalAssets.push({
        label     : 'Plugin CSS',
        paths     : [path.join( 'css', 'plugins' ), path.join( 'css', 'third_party' )],
        files     : options.plugins,
        extension : '.css',
        optional  : true
      });
    }
    if ( options.languages && options.languages !== [] ) {
      additionalAssets.push({
        label     : 'Language(s)',
        paths     : [path.join( 'js', 'languages' )],
        files     : options.languages,
        extension : '.js'
      });
    }
    if ( options.themes && options.themes !== [] ) {
      additionalAssets.push({
        label     : 'Themes(s)',
        paths     : [path.join( 'css', 'themes' )],
        files     : options.themes,
        extension : '.css'
      });
    }


    // Common logic to import plugins / languages / themes
    additionalAssets.forEach( asset => {


      // List of files for the given path(s)
      let pathFiles = {}; // key = filename, value = relative path with filename


      // Build complete list of files in all paths
      asset.paths.forEach( assetPath => {
        fs.readdirSync(
          path.join( froalaPath, assetPath )
        ).forEach( fileName => {
          pathFiles[ fileName ] = path.join( assetPath, fileName );
        });
      });


      // Bucket for missing files
      let missingFiles = [];


      // Convert the option value to an array,
      // depending on the option type
      if ( typeof asset.files === 'boolean' ) {


        // Generate a list of _all_ the available files
        asset.files = Object.keys(pathFiles).map(function( file ){
          return file.split('.')[0]; // remove extensions
        }).reduce(function( files, file ){
          if ( !files.includes( file ) ) files.push( file );
          return files; // return a unique list
        }, []);


      } else if ( typeof asset.files === 'string' ) {
        asset.files = [ asset.files ];


      } else if ( !Array.isArray( asset.files ) ) {
        throw new Error(
          `${this.name}: ${asset.label} ` +
          'option in ember-cli-build.js is an invalid type, ' +
          'ensure it is either a boolean (all or none), ' +
          'string (just one), or array (specific list)'
        );
      }


      // Loop through each requested file
      asset.files.forEach( file => {


        // Make sure the requested file exists
        if ( !pathFiles.hasOwnProperty( file + asset.extension ) ) {
          missingFiles.push( file );
          return; // continue;
        }


        // Import the asset file
        this.import(
          path.join( nodePath, pathFiles[ file + asset.extension ] )
        );


      }); // files.forEach()


      // Display an error message if any required files are missing
      if ( missingFiles.length > 0 && !asset.optional ) {
        throw new Error(
          `${this.name}: ${asset.label} ` +
          'specified in ember-cli-build.js are missing, ' +
          `make sure they are spelled correctly (${missingFiles.join(', ')})`
        );
      }


    }); // additionalAssets.forEach()


  } // included()


}; // module.exports

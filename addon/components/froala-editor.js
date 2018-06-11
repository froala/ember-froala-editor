import { Promise as EmberPromise } from 'rsvp';
import { schedule, bind } from '@ember/runloop';
import $ from 'jquery';
import { assign } from '@ember/polyfills';
import { getOwner } from '@ember/application';
import { readOnly, not } from '@ember/object/computed';
import { isHTMLSafe, htmlSafe } from '@ember/string';
import { computed, getWithDefault } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/froala-editor';


const FroalaEditorComponent = Component.extend({
  layout,
  classNames: ['froala-editor-container'],




  // Enable the ability to .extend() this Component
  // to define "default" options that will get merged
  // with any options passed in as an attribute
  mergedProperties: [
    'options'
  ],




  // jQuery selector to find the froala-editor container
  // Note: Using a nested `<div>` to prevent conflicts
  //       between ember and froala-editor for DOM changes
  editorSelector: 'div.froala-editor-instance',




  // Froala Editor prefixes all event names,
  // which is technically NOT a namespace,
  // and should be used when attaching event handlers
  // Note: Include the trailing dot
  eventPrefix: 'froalaEditor.',




  // Froala Editor event name that will trigger the
  // `update` action, mainly used to update the `content` value
  // and takes a cue from ember-one-way-controls
  updateEvent: 'contentChanged',




  // Option to return a SafeString when using on-*-getHtml event actions
  // By default, look at the current type of `content`
  returnSafeString: computed('content', {
    get() {
      return isHTMLSafe( this.get('content') );
    } // get()
  }), // :returnSafeString




  // Addon compatable access to the (potential) fastboot service
  // http://ember-fastboot.com/docs/addon-author-guide#accessing-the-fastboot-service
  fastboot: computed({
    get() {
      let owner = getOwner( this );
      return owner.lookup( 'service:fastboot' );
    } // get()
  }), // :fastboot




  // Private, internal Computed Property to handle SafeString support
  // and it will always return a string, even if `content` is null or undefined
  // Note: Both Strings and SafeStrings have a .toString() function
  _content: computed('content', {
    get() {
      let content = this.get('content');
      return (
        content && typeof content.toString === 'function' ?
        content.toString() :
        ''
      );
    } // get()
  }), // :_content




  // Private, internal Computed Property to merge all the possible "options"
  _options: computed('options', '_attributeOptions', {
    get() {
      const config = getOwner(this).resolveRegistration('config:environment');
      return assign(
        {},
        getWithDefault(config, 'ember-froala-editor', {}),
        this.getWithDefault('options', {}),
        this.get('_attributeOptions')
      );
    } // get()
  }), // :_options




  // Private, internal Computed Property to gather all the Froala Editor options
  // that are set as individual attributes. Ex: `{{froala-editor theme="red"}}`
  _attributeOptions: computed({
    get() {
      let attributeOptions = {};

      // Note: Use a for-in loop here over Object.keys() to get _all_ properties
      //       up the proto-chain, specifically needed when .extend()ing
      for ( let propertyName in this ) {

        // Verify that the property name aligns with a Froala Editor option name
        if ( $.FroalaEditor.DEFAULTS.hasOwnProperty( propertyName ) ) {
          attributeOptions[ propertyName ] = this.get( propertyName );
        }

      } // for ()

      return attributeOptions;
    } // get()
  }), // :_attributeOptions




  // Public facing API's for editor instance and state information
  // Note: The referenced properties are .set() on the init() hook
  editor            : readOnly( '_editor'             ),
  editorInitializing: readOnly( '_editorInitializing' ),
  editorInitialized : readOnly( '_editorInitialized'  ),
  editorDestroying  : readOnly( '_editorDestroying'   ),
  editorDestroyed   : not(      'editorInitialized'   ),




  /**********
   * Ember Lifecycle Hooks
   *
   * These will basically get everything going, from setup to tear down.
   * They are listed in the order they are typically called.
   **********/




  // Initialize the per-instance property defaults,
  // mainly for internal state flags and details.
  // https://guides.emberjs.com/v3.0.0/object-model/classes-and-instances/#toc_initializing-instances
  init() {
    this._super( ...arguments );
    this.set( '_editor'            , null  );
    this.set( '_editorInitializing', false );
    this.set( '_editorInitialized' , false );
    this.set( '_editorDestroying'  , false );
    this.set('_initPromises'       , []    );
    this.set('_templateContent'    , htmlSafe(this.get('_content')));
  }, // init()




  // Start the setup...
  // Note: Not called in fastboot mode, which is good
  didInsertElement() {
    this._super( ...arguments );
    schedule( 'afterRender', this, this.initEditor );
  }, // didInsertElement()




  // Look for changes in `content`
  // and update directly on the editor
  didUpdateAttrs() {
    this._super( ...arguments );

    let editor  = this.get('_editor');
    let content = this.get('_content');

    if ( this.get('fastboot.isFastBoot') ) {
      if ( content !== this.get('_templateContent').toString() ) {
        // Note: This works in fastboot because the editor is never initialized.
        //       See note below about needing to use jQuery after the editor has been initialized.
        this.set('_templateContent', htmlSafe(content));
      }
    } else if ( editor && content !== editor.html.get() ) {
      editor.html.set( content );
    } else if ( !editor && content !== this.$( this.get('editorSelector') ).html() ) {
      // Note: Must use jQuery! Updating a bound template property causes the following error,
      //       which is likely caused by the way froala-editor modifies DOM and Glimmer not liking that..
      // Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
      this.$( this.get('editorSelector') ).html( content );
    } else {
      // Note: _attributeOptions will only re-compute if editor is reinit'ed
      this.notifyPropertyChange('_attributeOptions');
    }

  }, // didUpdateAttrs()




  // Start the tear down...
  willDestroyElement() {
    this._super( ...arguments );
    this.destroyEditor();
  }, // willDestroyElement()




  /**********
   * Froala Editor Lifecycle Methods
   *
   * The following are methods used to setup and tear down the Froala Editor.
   * The Ember Lifecycle hooks will typically call these methods,
   * although they _could_ be called in a custom event handler.
   **********/




  // Responsible for the actual initialization of the Froala Editor
  // and sets up required event handlers and property observers
  initEditor() {

    // Do NOT re-initialize, user should call reinitEditor()
    if ( this.get('_editorInitialized') || this.get('_editorInitializing') ) {
      return;
    }


    // Update the state flag so we know initialization has started
    this.set( '_editorInitializing', true );


    // Get the complete set of options to be used
    let options = this.get('_options');


    // Init jQuery once...
    let $element = this.$( this.get('editorSelector') );


    // Attach a one time Froala Editor initialization event handler
    // to know when initialization has finished, updating state flags
    // Note: Cannot be done via editor.events.on()
    //       since access to `editor` is not available yet
    $element.one(
      this.get('eventPrefix') + (options.initOnClick ? 'initializationDelayed' : 'initialized'),
      bind(this, 'didInitEditor')
    );


    // Actual initialization of the Froala Editor
    $element.froalaEditor( options );

  }, // initEditor()




  // Just a quick method to destroy then initialize the editor,
  // the called methods will properly handle the current state
  reinitEditor() {
    this.destroyEditor();
    this.initEditor();
  }, // reinitEditor()




  // Responsible for destroying the Froala Editor and tearing down
  // everything that was setup in the initEditor() method
  destroyEditor() {

    // Do NOT try to destroy if there is nothing to destroy...
    // Note: !this.get('_editorInitialized') == this.get('editorDestroyed')
    if ( !this.get('_editorInitialized') || this.get('_editorDestroying') ) {
      return;
    }


    // Update the state flag so we know destroying has started
    this.set( '_editorDestroying', true );


    // Actual destruction of the Froala Editor
    this.$( this.get('editorSelector') ).froalaEditor( 'destroy' );

  }, // destroyEditor()




  /**********
   * Froala Editor Event Handlers
   *
   * Callbacks for event listeners setup by the
   * Froala Editor Lifecycle Methods above and
   * any event callbacks added by didInitEditor()
   **********/




  // Triggered by the Froala Editor initialization event, updates
  // component state flags, sets the original html/content, and
  // attaches event handlers directly to the editor
  didInitEditor( event, editor, ...params ) {
    this.set( '_editor', editor );


    // Determine which initialization event was used
    const initEventPropName = (
      this.get('_options.initOnClick') ?
      'on-initializationDelayed' :
      'on-initialized'
    );


    // Regex's used for replacing things in the property name
    const regexOnOrHtml = /(^on-|-getHtml$)/g;
    const regexHyphens  = /-/g;
    const regexDots     = /\./g;


    // Go through all the property names looking for event handlers, on-*
    // Note: Use a for-in loop here over Object.keys() to get _all_ properties
    //       up the proto-chain, specifically needed when .extend()ing
    for ( let propertyName in this ) {


      // Just need on-* properties...
      // if ( !propertyName.startsWith('on-') ) // ES2015 (requires polyfill)
      if ( propertyName.indexOf('on-') !== 0 ) {
        continue;
      }


      // Initialization actions will be triggered later,
      // that way the component is setup before calling the event action
      // if ( propertyName.startsWith(initEventPropName) ) // ES2015 (requires polyfill)
      if ( propertyName.indexOf(initEventPropName) === 0 ) {
        continue;
      }


      // Convert the property name to what the event name would be
      let eventName = propertyName;
      eventName = eventName.replace( regexOnOrHtml, '' );
      eventName = eventName.replace( regexHyphens , '.');


      // Special use case for the 'popups.hide.[id]' event
      // Ember usage would be 'on-popups-hide-id=(action)'
      // https://www.froala.com/wysiwyg-editor/docs/events#popups.hide.[id]
      // if ( eventName.startsWith('popups.hide.') ) // ES2016 (requires polyfill)
      if ( eventName.indexOf('popups.hide.') === 0 ) {
        let id = eventName.replace( 'popups.hide.', '' );
        id = id.replace( regexDots, '-' ); // Convert back to hyphens
        eventName = `popups.hide.[${id}]`;
      }


      // Attach the appropriate event handler
      // if ( propertyName.endsWith('-getHtml') ) // ES2016 (requires polyfill)
      let getHtmlPos = propertyName.indexOf('-getHtml', -8);
      if ( getHtmlPos !== -1 && getHtmlPos === propertyName.length - 8 ) {
        editor.events.on(
          eventName,
          bind( this, this.didEditorEventReturnHtml, propertyName, editor ),
          true
        );
      } else {
        editor.events.on(
          eventName,
          bind( this, this.didEditorEvent, propertyName ),
          true
        );
      }


    } // for ()


    // Get the update action and event name
    let update      = this.get('update');
    let updateEvent = this.get('updateEvent');


    // If there is an update action and event,
    // then bind an event handler to get the html
    if ( update && updateEvent ) {
      editor.events.on(
        updateEvent,
        bind( this, this.didEditorEventReturnHtml, 'update', editor ),
        true
      );
    }


    // Add the destroy event handler
    // Run _after_ any other destroy handler
    editor.events.on(
      'destroy',
      bind( this, this.didDestroyEditor, editor ),
      false
    );


    // Promise resolve functions added in the method() function below
    this.get('_initPromises').forEach( resolve => resolve() );
    this.set('_initPromises', []); // reset


    // Update editor state flags
    this.set( '_editorInitializing', false );
    this.set( '_editorInitialized' , true  );


    // Fire the "initialization" event actions (if defined)
    if ( this.get(initEventPropName) ) {
      this.didEditorEvent( initEventPropName, ...params );
    }
    if ( this.get(`${initEventPropName}-getHtml`) ) {
      this.didEditorEventReturnHtml( `${initEventPropName}-getHtml`, editor, ...params );
    }

  }, // didInitEditor()




  // Triggered by the 'froalaEditor.destroy' event,
  // updates component state flags
  didDestroyEditor() {
    this.set( '_editor'           , null  );
    this.set( '_editorDestroying' , false );
    this.set( '_editorInitialized', false );
    // No need for '_editorDestroyed', the Computed
    // Property 'editorDestroyed' fills that need
  }, // didDestroyEditor()




  // Event handler for the 'on-*' property actions, which should be strings or functions
  // When the action is a function, return the handlers returned value back to the editor,
  // this allows support of "canceling" a Froala Editor event.
  // Note: This function is only triggered for Froala Editor events
  //       that have a related 'on-*' property defined for Ember actions
  didEditorEvent( propertyName, ...params ) {
    if ( typeof this[ propertyName ] === 'function' ) {
      return this[ propertyName ](
        this,
        ...params
      );
    } else {
      // eslint-disable-next-line ember/closure-actions
      this.sendAction(
        propertyName,
        this,
        ...params
      );
    }
  }, // didEditorEvent()




  // Event handler for the 'on-*-getHtml' property actions,
  // returns the editors current html as the first argument.
  // This is mainly useful when combined with the (mut) helper
  // Note: This function is only triggered for Froala Editor events
  //       that have a related 'on-*-getHtml' property defined for Ember actions
  didEditorEventReturnHtml( propertyName, editor, ...params ) {

    // Get the HTML to return as the first argument
    let html = editor.html.get();


    // SafeString in = SafeString out..
    if ( this.get('returnSafeString') ) {
      html = htmlSafe( html );
    }


    // When the action is a function, return the handlers returned value back to the editor,
    // this allows support of "canceling" a Froala Editor event.
    if ( typeof this[ propertyName ] === 'function' ) {
      return this[ propertyName ](
        html,
        this,
        ...params
      );
    } else {
      // eslint-disable-next-line ember/closure-actions
      this.sendAction(
        propertyName,
        html,
        this,
        ...params
      );
    }

  }, // didEditorEventReturnHtml()




  /**********
   * Froala Editor Method APIs
   *
   * Expose the Froala Editor methods in "Ember land",
   * basically proxies everything to the editor instance...
   **********/




  // Generic method() function that will proxy the call
  // to the Froala Editor public API for methods
  // Notes: Also handles editor state properly by returning a Promise
  method( methodName ) {

    // Label for the following Promise, so it appears nicely in the Ember Inspector
    let promiseLabel = 'froala-editor: ';
    if ( methodName === 'reinit' ) {
      promiseLabel += 'Reninit method() call, waiting for the editor to initialize';
    } else if ( this.get('_editorInitialized') ) {
      promiseLabel += `Call editor method() '${methodName}'`;
    } else {
      promiseLabel += `Delayed method() call to '${methodName}', waiting for editor to initialize`;
    }


    // Always return a promise, no matter the state
    let promise = new EmberPromise( (resolve, reject) => {


      // "Extra", special ember-froala-editor specific method
      if ( methodName === 'reinit' ) {
        this.get('_initPromises').push( resolve );
        this.reinitEditor();


      // Editor is initialized, try calling the method now
      } else if ( this.get('_editorInitialized') ) {
        try {
          resolve(
            this.$( this.get('editorSelector') ).froalaEditor( ...arguments )
          );
        } catch (e) {
          reject(e);
        }


      // Editor is NOT initialize, wait before calling the method
      } else {
        this.get('_initPromises').push( resolve );
        // Follow-up method call is added as '.then()' below


      } // if else
    }, promiseLabel);


    // Continuation of "Editor is NOT initialize, wait before calling the method"
    if ( methodName !== 'reinit' && !this.get('_editorInitialized') ) {
      promise.then(() => {
        return new EmberPromise( (resolve, reject) => {
          try {
            resolve(
              this.$( this.get('editorSelector') ).froalaEditor( ...arguments )
            );
          } catch (e) {
            reject(e);
          }
        }, `froala-editor: Delayed method() call to '${methodName}', calling froala-editor method`);
      }); // promise.then()
    } // if ()

    return promise;
  }, // method()




  // Also define the method() as a Component action, that way it could be invoked
  // as component.send('method', 'method.name', 'arg') from an event handler
  actions: {
    method() {
      this.method( ...arguments );
    } // method()
  } // :actions


}); // Component.extend()


FroalaEditorComponent.reopenClass({
  positionalParams: ['content', 'update', 'options']
});


export default FroalaEditorComponent;

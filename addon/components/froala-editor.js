import Ember from 'ember';
import layout from '../templates/components/froala-editor';


export default Ember.Component.extend({
  layout,




  // Enable the ability the .extend() this Component
  // to define "default" options that will get merged
  // with any options passed in as an attribute
  mergedProperties: [
    'defaultOptions'
  ],




  // Empty options hash, .extend() this Component
  // to define defaults. Ex: `defaultOptions:{ heightMin:200 }`
  defaultOptions: {},




  // If there is no 'content' present then this is the
  // default content used when creating the editor
  // Note: This is the standard, "blank" Froala Editor content
  defaultContent: '',




  // Froala Editor technically does not keep the original
  // content updated. Therefore, by specifying a Froala Editor
  // event here, 'content' will be updated when the event fires.
  // To disable content binding, pass in a falsy content such as `false`.
  contentBindingEvent: 'contentChanged',




  // Froala Editor prefixes all event names,
  // which is technically NOT a namespace,
  // and should be used when attaching event handlers
  // Note: Include the trailing dot
  eventPrefix: 'froalaEditor.',




  // Mainly an internal Computed Property to determine if the
  // current 'content' is actually a SafeString object
  isSafeString: Ember.computed('content', function(){
    return this.get('content') instanceof Ember.Handlebars.SafeString;
  }),




  // Private, internal Computed Property to handle SafeString support
  // It converts SafeStrings to/from actual strings used by the editor
  _content: Ember.computed('content', {
    get() {
      if ( this.get('isSafeString') ) {
        return this.get('content').toString();
      } else {
        return this.get('content');
      }
    },
    set(key, value) {
      if ( this.get('isSafeString') ) {
        this.set( 'content', Ember.String.htmlSafe(value) );
      } else {
        this.set( 'content', value );
      }
      return value;
    }
  }),




  _options: Ember.computed('defaultOptions', 'options', {
    get() {
      let mergedOptions = {};

      // Use Ember.assign() if available (added in ember v2.5)
      if ( Ember.assign ) {
        mergedOptions = Ember.assign(
          mergedOptions,
          this.get('defaultOptions'),
          this.get('options')
        );

      // Fall back to Ember.merge() (depreciated as of ember v2.5)
      } else {
        mergedOptions = Ember.merge( mergedOptions, this.get('defaultOptions') );
        mergedOptions = Ember.merge( mergedOptions, this.get('options')        );
      }

      return mergedOptions;
    }
  }),




  // Because the Froala Editor itself will change the DOM,
  // we don't want this components template to also change
  // the DOM at the same time (may cause conflicts). So, these
  // are intermediate buckets that are updated by the
  // 'contentDidChange()' hook only when the editor is NOT initialized
  // Note: These properties are ONLY used in the template
  _templateContent: Ember.computed(function(){
    return this.get('_content');
  }),
  _hasContent: Ember.computed(function(){
    return this.get('hasContent');
  }),
  _defaultContent: Ember.computed(function(){
    return this.get('defaultContent');
  }),




  // Computed property used in the template to determine if the 'content'
  // contains anything and should be output
  hasContent: Ember.computed('_content', function(){
    return Ember.isPresent( this.get('_content') );
  }),




  // Public facing API's for editor instance and state information
  // Note: The referenced properties are .set() on the init() hook
  hasRendered       : Ember.computed.readOnly( '_hasRendered'        ),
  editor            : Ember.computed.readOnly( '_editor'             ),
  editorInitializing: Ember.computed.readOnly( '_editorInitializing' ),
  editorInitialized : Ember.computed.readOnly( '_editorInitialized'  ),
  editorDestroying  : Ember.computed.readOnly( '_editorDestroying'   ),
  editorDestroyed   : Ember.computed.not(      'editorInitialized'   ),




  /**********
   * Ember Lifecycle Hooks
   *
   * These will basically get everything going, setup and tear down.
   * They are listed in the order they are typically called.
   **********/




  // Initialize the per-instance property defaults,
  // mainly for internal state flags and details.
  // https://guides.emberjs.com/v2.3.0/object-model/classes-and-instances/#toc_initializing-instances
  init() {
    this._super( ...arguments );
    this.set( '_hasRendered'       , false );
    this.set( '_editor'            , null  );
    this.set( '_editorInitializing', false );
    this.set( '_editorInitialized' , false );
    this.set( '_editorDestroying'  , false );
    this.set( '_isSettingContent'  , false ); // No public API, internal state only
    this.set( '_shouldReinitEditor', false ); // No public API, internal state only
    this.set( '_shouldSetHtml'     , false ); // No public API, internal state only
  }, // init()




  // Use the didRender() hook instead of didInsertElement()
  // for Fastboot compatibility. Uses the '_hasRendered' flag to
  // call didInitialRender() the _first_ time it is rendered
  didRender() {
    this._super( ...arguments );
    if ( !this.get('_hasRendered') ) {
      this.set( '_hasRendered', true );
      this.didInitialRender();
    }
  }, // didRender()




  // Start the setup...
  // Simulates the didInsertElement() hook but is Fastboot compatible
  didInitialRender() {
    this.attachEventListeners();
    this.initEditor();
  }, // didInitialRender()




  // Trigger the proper "observer" when its related attribute value has changed
  didUpdateAttrs({ oldAttrs, newAttrs }) {

    // Get the values directly from the attrs
    let oldContent = this.getAttrFor( oldAttrs, 'content' );
    let newContent = this.getAttrFor( newAttrs, 'content' );


    // Convert SafeStrings to actual strings
    if ( oldContent instanceof Ember.Handlebars.SafeString ) {
      oldContent = oldContent.toString();
    }
    if ( newContent instanceof Ember.Handlebars.SafeString ) {
      newContent = newContent.toString();
    }


    // Only look for a 'content' difference, else assume the options changed
    // because this hook may have initially been missed when _an_ option was changed
    // https://ember-twiddle.com/f1740177799321f88eda
    if ( oldContent !== newContent ) {
      this.contentDidChange();
    } else {
      this.optionsDidChange();
    }

  }, // didUpdateAttrs()




  // Start the tear down...
  willDestroyElement() {
    this._super( ...arguments );
    this.destroyEditor();
    this.removeEventListeners();
  }, // willDestroyElement()




  /**********
   * Froala Editor Lifecycle Methods
   *
   * The following are methods used to setup and tear down the Froala Editor
   * and event listeners. The Ember Lifecycle hooks and event handlers will
   * typically call these methods, although they _could_ be called in a custom
   * event handler.
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


    // Required variables...
    let   $element            = this.$();
    const eventPrefix         = this.get('eventPrefix');
    const contentBindingEvent = this.get('contentBindingEvent');


    // Attach a one time 'froalaEditor.initialized' event handler
    // to know when initialization has finished, updating state flags
    $element.one(
      eventPrefix + 'initialized',
      Ember.run.bind(this, 'didInitEditor')
    );


    // Actual initialization of the Froala Editor
    $element.froalaEditor( this.get('_options') );


    // Attach an event handler to update the 'content' property when
    // the event occurs, but only if the 'content' property is used
    if ( contentBindingEvent && this.get('content') !== undefined ) {
      $element.on(
        eventPrefix + contentBindingEvent,
        Ember.run.bind(this, 'htmlDidChange')
      );
    }

  }, // initEditor()




  // Just a quick method to destroy then initialize the editor,
  // the called methods will properly handle the current state
  // Note: This is mainly for the optionsDidChange() handler
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


    // Required variables...
    let   $element            = this.$();
    const eventPrefix         = this.get('eventPrefix');
    const contentBindingEvent = this.get('contentBindingEvent');


    // Remove the event handler to update 'content' as the editor html changed
    if ( contentBindingEvent && this.get('content') !== undefined ) {
      $element.off(
        eventPrefix + contentBindingEvent,
        Ember.run.bind(this, 'htmlDidChange')
      );
    }


    // Attach a one time 'froalaEditor.destroy' event handler
    // to know when destruction has finished, updating state flags
    $element.one(
      eventPrefix + 'destroy',
      Ember.run.bind(this, 'didDestroyEditor')
    );


    // Actual destruction of the Froala Editor
    $element.froalaEditor( 'destroy' );

  }, // destroyEditor()




  // Looks for all "on-*" properties to attached the proper editor event listener,
  // which will then call the property action when the event is triggered
  attachEventListeners() {

    // Save the jQuery instance
    // to be reused in the for loop
    let $element = this.$();


    // Regex's used for replacing things in the property name
    const regexOnOrHtml = /(^on\-|\-getHtml$)/g;
    const regexHyphens  = /\-/g;
    const regexDots     = /\./g;


    // Technically the event type, but Froala Editor uses this
    // as a prefix for all of its events
    const eventPrefix = this.get('eventPrefix');


    // Go through all the property names looking for event handlers, on-*
    // Note: Use a for-in loop here over Object.keys() to get _all_ properties
    //       up the proto-chain, specifically needed when .extend()ing
    for ( let propName in this ) {


      // Just need on-* properties...
      // if ( !propName.startsWith('on-') ) // ES2015 (requires polyfill)
      if ( propName.indexOf('on-') !== 0 ) {
        continue;
      }


      // Initialization events will be handled by the `didInitEditor()` hook,
      // that way the component is setup before calling the event action
      if ( propName.indexOf('on-initialized') === 0 ) {
        continue;
      }


      // Convert the property name to what the event name would be
      let eventName = propName;
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
      // if ( propName.endsWith('-getHtml') ) // ES2016 (requires polyfill)
      let getHtmlPos = propName.indexOf('-getHtml', -8);
      if ( getHtmlPos !== -1 && getHtmlPos === propName.length - 8 ) {
        $element.on(
          eventPrefix + eventName,
          { propertyName:propName },
          Ember.run.bind(this, 'didEditorEventReturnHtml')
        );
      } else {
        $element.on(
          eventPrefix + eventName,
          { propertyName:propName },
          Ember.run.bind(this, 'didEditorEvent')
        );
      }


    } // for ()

  }, // attachEventListeners()




  // Simply remove all attached event listeners
  // for the editors "namespace" / event type
  removeEventListeners() {
    const eventPrefix = this.get('eventPrefix');
    this.$().off(
      // Get just the event name, basically removing the dot
      eventPrefix.slice( 0, eventPrefix.indexOf('.') )
    );
  }, // removeEventListeners()




  /**********
   * Froala Editor Event Handlers
   *
   * Handlers for event listeners and observers setup by the
   * Froala Editor Lifecycle Methods above.
   **********/




  // Triggered by the 'froalaEditor.initialized' event, updates
  // component state flags and properly updates the editor
  // if 'options' or 'content' changed _during_ initialization
  didInitEditor( event, editor, ...params ) {
    this.set( '_editorInitializing', false  );
    this.set( '_editorInitialized' , true   );
    this.set( '_editor'            , editor );

    // Set the editor html if the bound content
    // changed _during_ initialization...
    if (this.get( '_shouldSetHtml' )) {
      this.set( '_shouldSetHtml', false );
      editor.html.set( this.get('_content') );
    }

    // Re-initialize the editor if the options
    // changed _during_ initialization...
    if ( this.get('_shouldReinitEditor') ) {
      this.set( '_shouldReinitEditor', false );
      this.reinitEditor();
    }


    // Fire the "initialized" event actions (if defined)
    event.data = event.data || {};
    if ( this.get('on-initialized') ) {
      event.data.propertyName = 'on-initialized';
      this.didEditorEvent( event, editor, ...params );
    }
    if ( this.get('on-initialized-getHtml') ) {
      event.data.propertyName = 'on-initialized-getHtml';
      this.didEditorEventReturnHtml( event, editor, ...params );
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

    // Update the template variables in case the editor is initialized again
    this.set( '_templateContent', this.get('_content')   );
    this.set( '_hasContent',      this.get('hasContent') );
  }, // didDestroyEditor()




  // Triggered by the 'options' observer,
  // will properly update the editor by reinitializing it...
  optionsDidChange() {

    const debugMessage = 'froala-editor: ' +
      'Changing Froala Editor options after initialization is NOT performant! ' +
      'Technically the editor does not support changing options but the Ember ' +
      'Component will destroy the editor and re-initialize it to support this ' +
      'use case.'
    ;


    // If the editor has initialized already (most common),
    // just re-initialize the editor
    if ( this.get('_editorInitialized') ) {
      Ember.debug( debugMessage );
      this.reinitEditor();


    // If the editor is still initializing (less likely),
    // set a flag for didInitEditor
    } else if ( this.get('_editorInitializing') ) {
      Ember.debug( debugMessage );
      this.set( '_shouldReinitEditor', true );
    }


    // Else no need to worry if the editor has not been initialized at all,
    // it will pick-up the most current 'options' when initialized next time


  }, // optionsDidChange()




  // Triggered by the 'content' observer,
  // will properly update the editor html
  contentDidChange() {

    // The htmlDidChange() event hander, which .set()'s the content, will
    // inadvertently trigger this hook, the '_isSettingContent' flag is
    // our way to know when that is occurring and avoid creating a loop
    if ( this.get('_isSettingContent') ) {
      return;
    }


    // Properly update the editors html,
    // depending on the current state
    if ( this.get('_editorInitialized') ) {
      this._editor.html.set( this.get('_content') );
    } else if ( this.get('_editorInitializing') ) {
      this.set( '_shouldSetHtml', true );
    } else {
      this.set( '_templateContent', this.get('_content')   );
      this.set( '_hasContent',      this.get('hasContent') );
    }

  }, // contentDidChange()




  // Triggered by the 'contentBindingEvent',
  // will properly update the 'content' property
  // with the editors current html
  htmlDidChange( event, editor ) {
    this.set( '_isSettingContent', true );


    // Copy the editors new html to the components 'content'
    this.set( '_content', editor.html.get() );


    // Setting the flag back to `false` needs to be
    // wrapped in a run-loop, or else Ember will eagerly
    // reset it back to `false` before the contentDidChange()
    // hook has had a chance to run.
    Ember.run.next( this, function() {
      if (!this.isDestroying) {
        this.set( '_isSettingContent', false );
      }
    });

  }, // htmlDidChange()




  // Event handler for the 'on-*' property actions, which should be strings or functions
  // When the action is a function, return the handlers returned value back to the editor,
  // this allows support of "canceling" a Froala Editor event.
  // Note: This function is only triggered for Froala Editor events
  //       that have a related 'on-*' property defined for Ember actions
  didEditorEvent( event, editor, ...params ) {
    if ( typeof this[ event.data.propertyName ] === 'function' ) {
      return this[ event.data.propertyName ](
        event,
        this,
        ...params
      );
    } else {
      this.sendAction(
        event.data.propertyName,
        event,
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
  didEditorEventReturnHtml( event, editor, ...params ) {

    // Get the HTML to return as the first argument
    let html = editor.html.get();


    // SafeString in = SafeString out..
    if ( this.get('isSafeString') ) {
      html = Ember.String.htmlSafe( html );
    }


    // When the action is a function, return the handlers returned value back to the editor,
    // this allows support of "canceling" a Froala Editor event.
    if ( typeof this[ event.data.propertyName ] === 'function' ) {
      return this[ event.data.propertyName ](
        html,
        event,
        this,
        ...params
      );
    } else {
      this.sendAction(
        event.data.propertyName,
        html,
        event,
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
  // Notes: Also handles editor state properly by returning a Promise if need be
  method( methodName ) {

    // special, added, ember-froala-editor specific method
    if ( methodName === 'reinit' ) {
      this.reinitEditor();


    // Editor should be initialized before calling the method
    } else if ( this.get('_editorInitialized') ) {
      return this.$().froalaEditor( ...arguments );


    } else {


      // Label for the following Promise, so it appears nicely in the Ember Inspector
      const promiseLabel = 'froala-editor: ' +
        `Delayed method() call to '${methodName}' until editor is initialized`
      ;


      // Instead of throwing an error, lets return a Promise
      // that will call the method once the editor _is_ initialized
      return new Ember.RSVP.Promise( (resolve, reject) => {


        // Create a one time event listener for the initialized event
        this.$().one(
          this.get('eventPrefix') + 'initialized',
          () => {


            // Try calling the Froala Editor method, returning the outcome
            try {
              resolve(
                this.$().froalaEditor( ...arguments )
              );
            } catch (e) {
              reject(e);
            }


          } // () => {}
        ); // this.$().one()


      }, promiseLabel ); // Ember.RSVP.Promise()


    } // else ( !editorInitialized )

  }, // method()




  // Also define the method() as a Component action, that way it could be invoked
  // as component.send('method', 'method.name', 'arg') from an event handler
  actions: {
    method() {
      this.method( ...arguments );
    } // method()
  } // :actions


}); // export default

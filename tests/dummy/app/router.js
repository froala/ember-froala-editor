import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,


  // The following will maintain scroll position for each URL
  // Enables a more natural feel when using the browser Forward/Back buttons
  scrollPositions: Ember.inject.service(),
  didTransition() {
    this._super( ...arguments );
    // Wait for 'url' to change...
    Ember.run.next(this, function(){
      let scroll   = this.get('scrollPositions');
      let url      = this.get('url');
      let position = scroll.get( url );
      // Wait for things to settle, finish rendering...
      Ember.run.schedule('afterRender', this, function(){
        Ember.$( 'html,body' ).scrollTop( position || 0 );
      });
    });
  },
  willTransition() {
    this._super( ...arguments );
    let scroll = this.get('scrollPositions');
    let url    = this.get('url');
    scroll.set( url, window.scrollY );
  }


});

Router.map(function() {
  this.route('addon', function(){
    this.route('installation');
    this.route('configuration');
    this.route('concepts');
    this.route('test-helper');
  });
  // Different folder name to avoid collisions
  this.route('addon-components', {path:'components'}, function(){
    this.route('froala-editor');
    this.route('froala-content');
  });
  this.route('addon-helpers', {path:'helpers'}, function(){
    this.route('froala-method');
    this.route('merged-hash');
  });
});

export default Router;

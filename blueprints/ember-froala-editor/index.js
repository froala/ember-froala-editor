/* eslint-env node */
let VersionChecker = require('ember-cli-version-checker');

module.exports = {
  description: 'Add polyfills for older versions of ember.js',

  normalizeEntityName() {
    // allows us to run ember -g ember-bootstrap-switch and not blow up
    // because ember cli normally expects the format
    // ember generate <entitiyName> <blueprint>
  }, // normalizeEntityName()

  afterInstall() {
    let emberVersion = new VersionChecker(this).forEmber();
    if (emberVersion.lt('3.6.0')) {
      return this.addAddonsToProject([
        'ember-angle-bracket-invocation-polyfill',
        'ember-decorators-polyfill',
        'ember-modifier-manager-polyfill',
        'ember-native-class-polyfill'
      ]);
    } else if (emberVersion.lt('3.8.0')) {
      return this.addAddonsToProject([
        'ember-angle-bracket-invocation-polyfill',
        'ember-decorators-polyfill',
        'ember-modifier-manager-polyfill'
      ]);
    } else if (emberVersion.lt('3.10.0')) {
      return this.addAddonsToProject([
        'ember-angle-bracket-invocation-polyfill',
        'ember-decorators-polyfill'
      ]);
    }
  } // afterInstall()

}; // module.exports

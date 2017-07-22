# Ember Froala Editor Addon [![Build Status](https://travis-ci.org/froala/ember-froala-editor.svg?branch=master)](https://travis-ci.org/froala/ember-froala-editor) [![Ember Observer Score](http://emberobserver.com/badges/ember-froala-editor.svg)](http://emberobserver.com/addons/ember-froala-editor) [![Join the chat at https://gitter.im/froala/ember-froala-editor](https://badges.gitter.im/froala/ember-froala-editor.svg)](https://gitter.im/froala/ember-froala-editor?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


> Bring the [Froala WYSIWYG Editor](https://www.froala.com/wysiwyg-editor)
into an ember-cli project with this addon. Besides importing the required
Froala Editor files, the _main_ part of this addon is the `{{froala-editor}}`
component. Checkout the [documentation Website](http://froala.github.io/ember-froala-editor/)
for installation, configuration, and usage details.


## Compatibility

ember and ember-cli 2.4.2+


## Installation

```bash
ember install ember-froala-editor
```


## Configuration

Take a look at the [configuration documentation page](http://froala.github.io/ember-froala-editor/#/addon/configuration)
for details on the exact configuration options. But basically you add
`'ember-froala-editor':{}` within your `ember-cli-build.js` file and adjust
the available configuration options. Ex:

```js
// ember-cli-build.js
// ... (snip)

  'ember-froala-editor': {
    plugins  : true,
    languages: ['es','fr','de'],
    themes   : 'royal'
  },

// ... (snip)
```


## Usage

Take a look at the [documentation Website](http://froala.github.io/ember-froala-editor/)
for full usage details. But basically this addon comes with a few Ember
Components and Helpers to use within your project templates.

```hbs
{{froala-editor}}
{{froala-content}}
```

```hbs
(froala-method)
(merged-hash)
```


## Test Helper

This addon also provides a convenient test helper to interact with the editor
in acceptance tests. It functions similar to the [ember provided `fillIn()` test helper](http://emberjs.com/api/classes/Ember.Test.html#method_fillIn).
Take a look at the [Testing page on the docs Website](http://froala.github.io/ember-froala-editor/#/addon/test-helper)
for more details.

```js
fillInFroalaEditor('#my-editor', '<p>Foobar</p>');
```


## Development

* `git clone` this repository (fork if you plan on submitting a PR)
* `cd ember-froala-editor`
* `npm install`
* `bower install`


## Running Docs Server

* `ember server`
* Visit the docs at http://localhost:4200


## Running Tests

* `npm test` (Runs `ember try:each` to test against multiple Ember versions)
* `ember test`
* `ember test --server`
* `ember server` (Visit tests at http://localhost:4200/tests)


## Releasing

_Notes to self_ really...

1. If needed, bump the `froala-editor` version in `package.json` dependencies
2. Update the version in `tests/dummy/app/controllers/application.js` (hoping to remove this step later)
3. `npm version x.y.z` - Updates the version in `package.json` and tags in git
4. `git push origin master --follow-tags` - Pushes any changes and the new version tag up to Github
5. Update the new tag on the [Github Releases page](https://github.com/froala/ember-froala-editor/releases)
6. `npm run deploy` - Deploys the docs to `gh-pages` using [ember-cli-github-pages](https://github.com/poetic/ember-cli-github-pages#how-can-i-create-an-automated-deploy-script)
    * May need to `git push`, deploy will say if this is needed
7. `git checkout master` - Need to switch back to `master` after deploying the docs..
8. `npm publish` - Release the new version to the world!


## License

The `ember-froala-editor` project is under MIT license. However, in order to use Froala WYSIWYG HTML Editor plugin you should purchase a license for it.

Froala Editor has [3 different licenses](http://froala.com/wysiwyg-editor/pricing) for commercial use.
For details please see [License Agreement](http://froala.com/wysiwyg-editor/terms).

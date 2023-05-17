ember-froala-editor
==============================================================================

[![Build Status](https://github.com/froala/ember-froala-editor/workflows/CI/badge.svg)](https://github.com/froala/ember-froala-editor/actions?query=workflow%3ACI)
[![Ember Observer Score](http://emberobserver.com/badges/ember-froala-editor.svg)](http://emberobserver.com/addons/ember-froala-editor)
[![npm](https://img.shields.io/npm/v/ember-froala-editor.svg)](https://www.npmjs.com/package/ember-froala-editor)
[![npm](https://img.shields.io/npm/dm/ember-froala-editor.svg)](https://www.npmjs.com/package/ember-froala-editor)

> Bring the [Froala WYSIWYG Editor][2] into an [ember-cli][1] project with this
> addon. Besides importing the required Froala Editor files, the _main_ part of
> this addon is the `<FroalaEditor />` component, which adds the editor in your
> ember app. Other functionality is also included to help interact with the
> editor and content, see the [Usage](#Usage) section below.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.20 or above
* Ember CLI v3.20 or above
* Node.js v14, v16, or v18 and above
* _`ember-auto-import` v2 or above_

#### Note on `ember-auto-import` version requirement

This addon (and Ember v4+) uses `ember-auto-import` v2, which implies that
consuming projects also use `ember-auto-import` v2. Outside of
`npm install --save-dev ember-auto-import@^2.0.0 webpack`, take a look at the
[upgrade guide](https://github.com/ef4/ember-auto-import/blob/main/docs/upgrade-guide-2.0.md)
for further details when upgrading from `ember-auto-import` v1.


Upgrading from 3.x
------------------------------------------------------------------------------

The only change is with the configuration options in `ember-cli-build.js`. All
option types (languages, plugins, themes) must now be arrays with specific
assets listed. Boolean and string values are no longer supported. Ex:

**From**
```js
let app = new EmberApp(defaults, {
  'ember-froala-editor': {
    languages: 'es',
    plugins  : ['align','char_counter'],
    themes   : true
  }
});
```

**To**
```js
let app = new EmberApp(defaults, {
  'ember-froala-editor': {
    languages: ['es'],
    plugins  : ['align','char_counter'],
    themes   : ['dark','gray','royal']
  }
});
```

No other changes needed from an ember perspective. Installation and usage is
still the same, but editor configuration options might have changed. See the
[Froala Editor docs](https://froala.com/wysiwyg-editor/docs/migrate-from-version-3-to-version-4/)
for those details.


Installation
------------------------------------------------------------------------------

```
ember install ember-froala-editor
```


Configuration
------------------------------------------------------------------------------

This addon will import files from the `froala-editor` package into the build-tree
to be included in the final app output. This covers the [Download details][3]
on the Froala Editor docs to get the main editor files into your project. You
can additionally include [languages][4], [plugins][5], and [themes][6] by
adding configuration details in your `ember-cli-build.js` file.

Within the `ember-cli-build.js` file, add a `ember-froala-editor` object and
list which additional assets to include in an array. For plugins, you can use
either the plugin name as shown in the Froala Editor docs or file name (without
the extension). Ex:

```js
// ember-cli-build.js
// ... (snip)
let app = new EmberApp(defaults, {
  'ember-froala-editor': {
    languages: ['es','fr','de'],
    plugins  : ['align','charCounter','paragraph_format'],
    themes   : ['royal']
  }
});
// ... (snip)
```


Usage
------------------------------------------------------------------------------

This addon includes a couple components, several template helpers, and a couple
test helpers.

### `<FroalaEditor>` Component

The `<FroalaEditor>` component exposes many aspects of the Froala Editor in
"Ember ways" and uses the `<div contenteditable>` version of the editor (not
`<textarea>`). And with the Froala Editor being a third-party program, this
component will handle proper setup and teardown.

```hbs
<FroalaEditor />
```

Pass-in existing HTML/content via the `@content` argument and capture changes
from the `@update` argument (which should be a setter, including `{{mut}}`).
However, when using `{{mut}}` it must be wrapped in `{{fn}}` to retain the
function (setter) aspect. The `@content` must be a SafeString from
[`htmlSafe`][14] and `@update` will also return a SafeString.

```hbs
<FroalaEditor
  @content={{this.content}}
  @update={{fn (mut this.content)}}
/>
```

The `@update` setter will be called on the [`contentChanged` editor event][9]
by default. There *is* a slight debounce effect with that event, which may or
may not be desirable. To change which event is used, pass in the event name
through the `@updateEvent` argument.

```hbs
<FroalaEditor
  @content={{this.content}}
  @update={{fn (mut this.content)}}
  @updateEvent="input"
/>
```

[Options][7] can be passed in through the `@options` argument or individually
using the option name as the `@argument` name. Note: If the same option is
passed within the `@options` argument and individual argument, the individual
argument will "win". In the example below, the theme would be "dark".

```hbs
<FroalaEditor
  @options={{hash theme="gray"}}
  @theme="dark"
/>
```

[Event callbacks][8] can be passed into the component using the `@on-*` argument
format, where the event name is prefixed with `@on-`. Also, when an event has a
period in the name, replace it with a dash. The callback will be given the editor
instance as the first argument, with the other event params (if any) following.

```hbs
<FroalaEditor
  @on-focus={{this.focusCallback}}
  @on-paste-afterCleanup={{this.pasteCallback}}
  @on-commands-after={{this.commandsCallback}}
/>
```

The callback signatures should look like;

```js
function(editor, ...params) {}
// Or for the examples above
function focusCallback(editor) {}
function pasteCallback(editor, clipboard_html) {}
function commandsCallback(editor, cmd, param1, param2) {}
```

The `<FroalaEditor>` also watches the `@disabled` state and will appropriately
enable/disable the editing abilities when this argument changes. It basically
is the equivalent to the `<textarea disabled>` attribute.

```hbs
<FroalaEditor
  @disabled={{this.disabled}}
  @on-edit-on={{this.editorEnabledCallback}}
  @on-edit-off={{this.editorDisabledCallback}}
/>
```


### `<FroalaContent>` Component

According to the [Froala Editor documentation][12], content created from the
editor should be contained within an element with the `.fr-view` class. This
is simply a component that applies the class. It can be used in either inline
(with the `@content` argument) or block form, but either should be SafeString
from the [`htmlSafe()`][14].

```hbs
{{!-- this.content = htmlSafe('<p>Content here</p>') --}}
<FroalaContent @content={{this.content}} />
<FroalaContent>{{this.content}}</FroalaContent>
```

Either will render:

```html
<div class="fr-view"><p>Content here</p></div>
```


### `{{froala-arg}}` Template Helper

This helper creates a closure that will capture the editor instance and pass it
into the [event callback][8] as the first argument, with the other event args
following. The Froala Editor binds callbacks to the editor instance, so `this`
is the editor and not the original context (even with the `@action` decorator).

Note: All `@on-*` arguments on the `<FroalaEditor>` already have this applied
automatically. This is mainly useful when passing callbacks through the
[`events` option][10].

```hbs
<FroalaEditor
  @options={{hash events=(hash click=(froala-arg this.callback))}}
  @on-click={{this.callback}}
/>
```

The callback signature should look like;

```js
function(editor, ...args) {}
// Or for the example above with the click event
function(editor, clickEvent) {}
```


### `{{froala-html}}` Template Helper

This helper creates a closure that will pass the editors current HTML/content
as the first argument to the callback function. This is very useful when
combined with setters or the `{{mut}}` helper.
Ex: `{{froala-html (fn (mut this.content))}}`

Note: The `@update` argument on `<FroalaEditor>` already has this applied
automatically. This is mainly useful when needing HTML on other callbacks
but can also be done by calling `editor.html.get()` from within your callback.

```hbs
<FroalaEditor
  @options={{hash events=(hash input=(froala-html this.callback))}}
  @on-input={{froala-html this.callback}}
/>
```

The callback signature should look like;

```js
function(html, editor, ...args) {}
// Or for the example above with the input event
function(html, editor, inputEvent) {}
```


### `{{froala-method}}` Template Helper

This helper creates a closure that will call an [editor method][11] when
called. It is meant to replace an [event callback][8] on the
`<FroalaEditor>` component. Simply specify the [method name][11] as the
first parameter of the helper.

```hbs
<FroalaEditor
  @on-paste-after={{froala-method "commands.undo"}}
/>
```

The helpers first parameter will be used as the editor method to be called, and
the remaining parameters will be used for method arguments. So you can pass in
the proper arguments as documented, and they will be spread out when called. Ex:

```hbs
{{froala-method "align.apply" "right"}}
```

In addition, you can use values from the event callback and "proxy" them to the
method. First, define a parameter in the position which the argument should be
passed in (_to_). Then define a hash with the same name and an integer of the
position (1 indexed) which the argument would have been received (_from_). Ex:

```hbs
<FroalaEditor
  @on-save-error={{froala-method "html.insert" "message" message=2}}
/>
```

In the above example, the "on-save-error" event callback would have received
`(editor, error)`. In the `{{froala-method}}` helper we defined a "message"
and told it to use the second argument, which is `error`.


### `{{html-safe}}` Template Helper

Since the `<FroalaEditor>` requires that `@content` be a SafeString from
[`htmlSafe()`][14], this helper can provide a way to convert a content *string*
when passing to the editor component. However, you should also sanitize the
content going in to guard against XSS exploits.

Note: This helper is **NOT** automatically imported into the app. Rather,
you must create your own helper to re-export the helper from this addon.

1. `ember generate helper html-safe`
2. Change `app/helpers/html-safe.js` to `export { default } from 'ember-froala-editor/helpers/html-safe';`
3. Use `{{html-safe}}` in your app templates

```hbs
<FroalaEditor
  @content={{html-safe this.content}}
/>
```


### `{{to-string}}` Template Helper

Since the `<FroalaEditor>` requires that `@content` to be a SafeString, it will
also return a SafeString from the `@update` callback (and any callbacks that
use the `{{froala-html}}` helper). This helper will convert that SafeString
back to a normal string. However, you should also sanitize the content coming
back to guard against XSS exploits.

Note: This helper is **NOT** automatically imported into the app. Rather,
you must create your own helper to re-export the helper from this addon.

1. `ember generate helper to-string`
2. Change `app/helpers/to-string.js` to `export { default } from 'ember-froala-editor/helpers/to-string';`
3. Use `{{to-string}}` in your app templates

```hbs
<FroalaEditor
  @content={{html-safe this.content}}
  @update={{to-string (fn (mut this.content))}}
/>
```


### `{{merged-hash}}` Template Helper

This helper is a little out-of-scope for this addon, but can be very useful
when you need to use a combination of [`options`][7]. It allows you to use an
object / hash property but also add others or override options. Ex:

```hbs
<FroalaEditor
  @options={{merged-hash this.parentOptions heightMin=400}}
/>
```

The helper assumes all parameters are objects, and then uses [assign()][15] to
merge everything together. Each parameter takes priority on the previous, with
the "hash" (named parameters) being the final. So you can merge multiple
"levels" of options. Ex:

```hbs
{{merged-hash
  this.applicationOptions
  this.routeOptions
  pastePlain=true
  placeholderText="Only plain text can go here..."}}
```

Note: This helper is **NOT** automatically imported into the app. Rather,
you must create your own helper to re-export the helper from this addon.

1. `ember generate helper merged-hash`
2. Change `app/helpers/merged-hash.js` to `export { default } from 'ember-froala-editor/helpers/merged-hash';`
3. Use `{{merged-hash}}` in your app templates


### `fillInFroalaEditor()` Test Helper

Test helper to best simulate content within the editor changing. It uses the
[`fillIn()` helper provided by `ember-test-helpers`][22] but just ensures the
correct DOM element is targeted. It requires a selector (string) as the first
argument and HTML (string or [SafeString][14]) as the second argument. As an
async function, you should `await` the results before continuing with your test.

```js
import { fillInFroalaEditor } from 'ember-froala-editor/test-support';
await fillInFroalaEditor('#editorId', '<p>HTML</p>');
```


### `getInFroalaEditor()` Test Helper

Test helper that grabs the `innerHTML` of the editor content, simple as that.
It returns the HTML as a string and *not* a SafeString, unlike `{{froala-html}}`.

```js
import { getInFroalaEditor } from 'ember-froala-editor/test-support';
let content = getInFroalaEditor('#editorId');
```

So putting both of these test helpers together, an [Acceptance Test][18] might
look something like this;

```js
import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { fillInFroalaEditor, getInFroalaEditor } from 'ember-froala-editor/test-support';

module('Acceptance | FroalaEditor', function(hooks) {
  setupApplicationTest(hooks);

  test('<FroalaEditor> properly updates when content is filled in', async function(assert) {
    assert.expect(2);

    await visit('/');
    assert.strictEqual(getInFroalaEditor('#editor'), '<p>Foobar</p>');

    await fillInFroalaEditor('#editor', '<p>Foobaz</p>');
    assert.strictEqual(getInFroalaEditor('#editor'), '<p>Foobaz</p>');
  });
});
```


Defaults for `<FroalaEditor>` component
------------------------------------------------------------------------------

Most likely you will have customizations/options that are common across many/all
of your `<FroalaEditor>` instances. Instead of passing around a shared `options`
object, there are a few ways to apply "default" options at once. And both ways
can be applied at the same time (ex: `environment.js` for the key and extending
for options/callbacks).

### `environment.js` config

The `<FroalaEditor>` first looks to your `config/environment.js` file for a
`ember-froala-editor` object to use as the [`options`][7]. This is a great
place for your key after purchasing the Froala Editor.

```js
'use strict';

module.exports = function(environment) {
  var ENV = {
    // (other default code snipped...)

    'ember-froala-editor': {
      key: '_YOUR_KEY_HERE_'
    }

  };
  // ... (other default code snipped...)
  return ENV;
};
```


### Extending `<FroalaEditor>` component

The `<FroalaEditor>` was created with extending and applying defaults in mind.
Simply generate a new component within your app, extending from the addons
component and apply [options][7] and [event callbacks][8], similar to invoking
the editor in a template by passing arguments, but instead make them class
properties and methods.

1. `ember generate component-class froala-editor`
2. Change `app/components/froala-editor.js` to the example show below, where the editor is extended
3. Add [options][7] to the `options = {}` object or individually
4. Add [event callbacks][8] with the `on-eventName` naming strategy
  * Note: Use the `@action` decorator to retain the component context

```js
// app/components/froala-editor.js
import FroalaEditorComponent from 'ember-froala-editor/components/froala-editor';

export default class FroalaEditor extends FroalaEditorComponent {
  options = {
    theme: "gray"
  };
  // OR
  theme = "gray";

  'on-eventName'(editor, ...args) {/* this = editor */}
  @action 'on-eventName'(editor, ...args) {/* this = component */}
}
```


Custom Elements
------------------------------------------------------------------------------

The Froala Editor allows the creation of [custom elements][13] to use within
the editor, such as custom buttons, dropdowns, popups, icons, and plugins.
These should be created from within an [application initializer][17] so they
are created/setup just once. Then you can use them within the editor as shown
in the Froala Editor docs.

1. `ember generate initializer froala-editor-elements` -- Or name(s) of your choosing
2. `import FroalaEditor from 'froala-editor';`
3. `FroalaEditor.DefineIcon()`, `FroalaEditor.RegisterCommand()`, etc.

```js
import FroalaEditor from 'froala-editor';

export function initialize(/* application */) {
  FroalaEditor.RegisterCommand('myButton', {});
}

export default {
  initialize
};
```


FAQ
------------------------------------------------------------------------------

#### Why can't I use the `{{on}}` modifier for Froala Editor events?
Starting with Froala Editor v3, it no longer triggers custom events on the DOM.
Instead, the new way is to pass callbacks into the `options.events` object,
or use the `editor.events.on()` method. This is done for you with the
`<FroalaEditor />` component by taking all  `@on-*` args and adding them
to the editor using the `editor.events.on()` method.

#### Why can't I customize the editor `tagName`?
With the move to Glimmer Components, the `tagName` is no longer customized
through the component class. Rather, the forthcoming(?) `(element)` helper
will fill this need but it is not released in Ember.js proper yet. Once it is,
you'll be able to customize the emitted DOM Element using the `@tagName` argument.
Just to note, the Froala Editor itself modifies the DOM quite a bit, so the
emitted element might change anyway.

#### Why can't content be passed into `<FroalaEditor>` in block form?
Content changes must be captured by the component to properly update the editor
using `editor.html.set()` instead of through the Glimmer template. When content
is passed in via block form (`<FroalaEditor>{{this.content}}</FroalaEditor>`)
there is no way for the Glimmer component class to capture updates.

#### Is there a way to enable two-way binding of `@content`?
As of this writing, no. Ember Octane with Glimmer Components do not allow
two-way bound `@arguments` whatsoever. However, there has been discussion
on how to explicitly enable two-way binding in some manor, possibly by
a "boxing" a value with a setter. The `<FroalaEditor>` was designed with
this in mind, where the `@update` argument could look for a setter on
`@content`, without needing to pass in the setter explicitly/separately.

#### Why can't `@content` be a regular string anymore?
There has been some debate on if the `<FroalaEditor>` itself should automatically
display `@content` unescaped by applying [`htmlSafe()`][14]. Rather, the user
of the component should indicate that the `@content` is Ok to display in its'
current form. Additionally, by requiring a SafeString, the addon was able to
allow greater backwards compatibility without resorting to computeds. We can
always go back on this decision but it was a good change to make at v3.

#### Why is my build output size larger with v4?
With the move to `ember-auto-import`, all possible dynamic `import()` assets
are included in the build. Therefore, all language files, plugins, and themes
will be included in the project build output. However, only those listed in
your `ember-cli-build.js` `ember-froala-editor` options will actually be
requested by your browser.

#### Why is it recommended to depend upon a minor version and not major?
Ex: `~4.0.0` instead of `^4.0.0`. Froala would like this addon (and other
official integrations) to match versions of the main editor package. 
While we try to withold breaking changes to a major release, there are times
where changes in the Ember ecosystem require changes to the addon, before the
next major release of the Froala Editor (we note these in the release notes).


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

The `ember-froala-editor` project is under [MIT License](LICENSE.md). However, in
order to use Froala WYSIWYG HTML Editor plugin you must purchase a license for it.

Froala Editor has [3 different licenses](http://froala.com/wysiwyg-editor/pricing) for commercial use.
For details please see [License Agreement](http://froala.com/wysiwyg-editor/terms).


[1]: https://github.com/ember-cli/ember-cli
[2]: https://www.froala.com/wysiwyg-editor
[3]: https://www.froala.com/wysiwyg-editor/download
[4]: https://www.froala.com/wysiwyg-editor/languages
[5]: https://www.froala.com/wysiwyg-editor/docs/plugins
[6]: https://www.froala.com/wysiwyg-editor/examples/color-themes
[7]: https://www.froala.com/wysiwyg-editor/docs/options
[8]: https://www.froala.com/wysiwyg-editor/docs/events
[9]: https://www.froala.com/wysiwyg-editor/docs/events#contentChanged
[10]: https://www.froala.com/wysiwyg-editor/docs/options#events
[11]: https://www.froala.com/wysiwyg-editor/docs/methods
[12]: https://www.froala.com/wysiwyg-editor/docs/overview#display
[13]: https://www.froala.com/wysiwyg-editor/docs/concepts/custom/button
[14]: https://api.emberjs.com/ember/release/functions/@ember%2Ftemplate/htmlSafe
[15]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
[16]: https://api.emberjs.com/ember/release/classes/String/methods/camelize?anchor=classify
[17]: https://guides.emberjs.com/release/applications/initializers/#toc_application-initializers
[18]: https://guides.emberjs.com/release/testing/acceptance/
[19]: https://emberjs.com/editions/octane/
[20]: https://www.froala.com/wysiwyg-editor/changelog
[21]: https://github.com/emberjs/rfcs/blob/master/text/0389-dynamic-tag-names.md
[22]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillin

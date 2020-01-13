ember-froala-editor
==============================================================================

[![Build Status](https://travis-ci.org/froala/ember-froala-editor.svg?branch=master)](https://travis-ci.org/froala/ember-froala-editor)
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

* Ember.js v3.4 or above
* Ember CLI v3.4 or above
* Node.js v10 or v12 and above


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
list which additional assets to include. The values of each key can be;
`boolean` for all/none, `string` for one, or an `array` of `strings` for
multiple. For example, to include a few languages, all plugins and one theme;

```js
// ember-cli-build.js
// ... (snip)
let app = new EmberAddon(defaults, {
  'ember-froala-editor': {
    languages: ['es','fr','de'],
    plugins  : true,
    themes   : 'royal'
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
    assert.equal(getInFroalaEditor('#editor'), '<p>Foobar</p>');

    await fillInFroalaEditor('#editor', '<p>Foobaz</p>');
    assert.equal(getInFroalaEditor('#editor'), '<p>Foobaz</p>');
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
5. Add a new template file to re-export the original template (see second code example below)

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

```js
// app/templates/components/froala-editor.js
export { default } from 'ember-froala-editor/templates/components/froala-editor';
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


Upgrading from 2.x
------------------------------------------------------------------------------

In addition to the [Froala Editor changes][20] itself, this addon has changes
between 2.x and 3.x. Mainly, the addon has been updated to use [Ember Octane][19]
features and programing models. Here are the addon changes between 2.x and 3.x:

### jQuery no longer a required dependency
This is probably why you're looking at 3.x in the first place. :) The Froala
Editor (and this addon) no longer requires jQuery so you can configure ember
to not include it in your build:

```bash
ember feature:disable jquery-integration
```

### Import `FroalaEditor` instead of accessing from `$.FroalaEditor`
With the removal of jQuery integration, the Froala Editor is instead importable
from the `froala-editor` package. This will mostly impact any [custom elements][13]
that are setup on [application initializers][17].

**From**
```js
import $ from 'jquery';
export function initialize(/* application */) {
  $.FroalaEditor.RegisterCommand('myButton', {});
};
export default {
  name: 'froala-custom',
  initialize: initialize
};
```

**To**
```js
import FroalaEditor from 'froala-editor';
export function initialize(/* application */) {
  FroalaEditor.RegisterCommand('myButton', {});
};
export default {
  initialize
};
```

### `ember-font-awesome` no longer an added dependency
The Froala Editor 2.x series used FontAwesome icons but starting with 3.0
they ship their own. Therefore this addon no longer adds `ember-font-awesome`
to your projects dependencies and can remove if not needed elsewhere in your app:

```bash
npm uninstall ember-font-awesome --save-dev
```

### `<AngleBracket>` invocation style
While not required, the Ember Octane programming model uses angle-bracket
invocation style when using components. That means replace `{{}}` with `<>`
and [classify][16] the component name. Putting this together;

**From**
```hbs
{{froala-editor}}
{{froala-content}}
```

**To**
```hbs
<FroalaEditor />
<FroalaContent />
```

### Pass component attributes as `@arguments`
While also an Ember Octane programming model, but also required with the move
to Glimmer Components, component attributes must now be passed in as arguments.
Simply add `@` to the beginning of the name.

**From**
```hbs
{{froala-editor content=this.content}}
{{froala-content content=this.content}}
```

**To**
```hbs
<FroalaEditor @content={{this.content}} />
<FroalaContent @content={{this.content}} />
```

### Positional params no longer supported
With the move to Glimmer Components, and using angle-bracket invocation,
positional parameters are no longer supported. Instead, you must specify
the argument name when passing in `@content`, `@update`, and `@options`.

**From**
```hbs
{{froala-editor
  this.content
  (action (mut this.content))
  (hash theme="gray")
}}
{{froala-content
  this.content
}}
```

**To**
```hbs
<FroalaEditor
  @content={{this.content}}
  @update={{fn (mut this.content)}}
  @options={{hash theme="gray"}}
/>
<FroalaContent
  @content={{this.content}}
/>
```

### `@content` must now be a SafeString
Previously the `content` could be a string or SafeString and the component would
properly handle either type. Now the component requires that `@content` be a
SafeString to indicate the incoming content has been properly guarded against
potential XSS exploits. This addon now provides a couple helpers to work around
this change but are opt-in only by importing them into your app (they are not
automatically available). Take a look at the documentation for `{{html-safe}}`
and `{{to-string}}` above. So if you still plan on using strings;

**From**
```hbs
{{froala-editor
  content=this.htmlString
  update=(action (mut this.htmlString))
}}
```

**To**
```hbs
<FroalaEditor
  @content={{html-safe this.htmlString}}
  @update={{to-string (fn (mut this.htmlSafe))}}
/>
```

### `on-*-getHtml` callbacks replaced with `{{froala-html}}` helper
The 2.x series of this addon provided a special way to get the editors current
html/content as the first argument in action callbacks. This functionality has
been moved to a template helper that will wrap your callback to provide the
same functionality.

**From**
```hbs
{{froala-editor on-blur-getHtml=(action (mut this.content))}}
```

**To**
```hbs
<FroalaEditor @on-blur={{froala-html (fn (mut this.content))}} />
```

### Event callbacks now passed the `editor` instead of `component`
With closer integration with the Froala Editor (because it's not a jQuery
plugin anymore), the editor instance is passed to event callbacks instead
of the component instance.

**From**
```js
function callback(component, ...params) {
  let editor = component.get('editor');
}
```

**To**
```js
function callback(editor, ...params) {
  let component = editor.component;
}
```

### Call methods directly on the editor instead of `method()` action
Calling editor methods in the 2.x series required you to go through the jQuery
integration, which the `{{froala-editor}}` component hid-away in the `method()`
action. But with 3.0 you can call them directly on the editor instance.
Additionally, you no longer need to deal with the Promise returned by `method()`!

**From**
```js
function callback(component, ...args) {
  let html = await component.method('html.get');
}
```

**To**
```js
function callback(editor, ...args) {
  let html = editor.html.get();
}
```

### `tagName` no longer supported (at the moment)
The `{{froala-editor}}` results in a `<div>` element but that previously could
be changed with the `tagName` attribute. That is not supported out of the box
with Glimmer Components but is [being worked on with an approved RFC][21].

### Editor is no longer "wrapped"
Previously the `{{froala-editor}}` was wrapped in two `<div>`'s, once with the
component tag/element itself and another as the actual Froala Editor instance.
With the move to Glimmer Components, this was no longer required to "contain"
the editor DOM changes so now only a single `<div>` is used for the editor
instance. This might effect any CSS styling that you may have done.

**From**
```css
.froala-editor-container .froala-editor-instance {}
```

**To**
```css
.fr-box {}
```

Or apply your own class by passing in the `class` attribute;

```hbs
<FroalaEditor class="my-class-name" />
```

### Extending the editor is now class-based
When extending the `<FroalaEditor>` component, it is now native class based
instead of `EmberObject` based. Therefore, be sure to add properties and
methods as such in the class instead of the object/hash way:

**From**
```js
import FroalaEditorComponent from 'ember-froala-editor/components/froala-editor';
export default FroalaEditorComponent.extend({
  options: {},
  'on-blur': function() {}
});
```

**To**
```js
import FroalaEditorComponent from 'ember-froala-editor/components/froala-editor';
export default class FroalaEditor extends FroalaEditorComponent {
  options = {};
  'on-blur'() {}
}
```

### Special `reinit` method no longer available
With 2.x there was a special `reinit` method on the `{{froala-editor}}`
component that would destroy and re-initialize the editor. This was useful
to make a "hide-on-blur" effect where the editor would go back to the
`initOnClick` mode when the user focused away. If this is something you had
used, and would like to see again, please open a new Issue on the repository.

### `{{merged-hash}}` helper no longer imported into app build-tree
While the `{{merged-hash}}` helper is still provided by this addon, it is no
longer automatically imported for use in your app. Rather, you must create
your own helper and re-export the addons helper. Take a look at the docs
above for `{{merged-hash}}` importing details.


FAQ
------------------------------------------------------------------------------

#### Why can't I use the `{{on}}` modifier for Froala Editor events?
With Froala Editor v3, it no longer triggers custom events on the DOM.
Instead, the new way is to pass callbacks into the `options.events` block,
or use the `editor.events.on()` method. This is done for you with the
`<FroalaEditor />` component by taking all  `@on-*` args and adding them
to the editor using the `editor.events.on()` method.

#### Why can't I customize the editor `tagName`?
With the move to Glimmer Components, the `tagName` is no longer customized
through the component class. Rather, the forthcoming `(element)` helper
will fill this need but it is not released in Ember.js proper yet. Once it is,
you'll be able to customize the emitted DOM Element using the `@tagName` argument.
Just to note, the Froala Editor itself modifies the DOM quite a bit, so the
emitted element might change anyway.

#### Why can content be passed into `<FroalaEditor>` in block form?
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

#### Why is it recommended to depend upon a minor version and not major?
Ex: `~3.0.0` instead of `^3.0.0`. Froala would like this addon (and other
official integrations) to match versions of the main editor package. 
Therefore, breaking changes with this addon will be at minor releases 
(when there are any). While not every minor release has breaking changes,
Embroider (addon v2 package format) will come at a minor release and will 
likely require a different way to import components and helpers from this addon.

### What happend to the 3.0.x versions?
Due to Froala wanting to keep this addon version in alignment with the editor
and embers move towards Ember Octane edition, this addon was in development
during the editors 3.0.x versions. While you'll see betas under the 3.0.0 label
it wasn't fully released until Froala released 3.1.0 of the editor.

#### What happened to the docs site?
Moving to `ember-cli-addon-docs` but just haven't gotten to it yet. The "old"
docs site was not updated for 3.x so references here have been removed, for now.


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
[15]: https://api.emberjs.com/ember/release/functions/@ember%2Fpolyfills/assign
[16]: https://api.emberjs.com/ember/release/classes/String/methods/camelize?anchor=classify
[17]: https://guides.emberjs.com/release/applications/initializers/#toc_application-initializers
[18]: https://guides.emberjs.com/release/testing/acceptance/
[19]: https://emberjs.com/editions/octane/
[20]: https://www.froala.com/wysiwyg-editor/changelog
[21]: https://github.com/emberjs/rfcs/blob/master/text/0389-dynamic-tag-names.md
[22]: https://github.com/emberjs/ember-test-helpers/blob/master/API.md#fillin

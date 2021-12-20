# Release Process

1. `npm install froala-editor@x.y.z --save` - Updates the editor dependency and lock-file to the specific version
2. Check for new languages, plugins, and themes - Add to `index.js` and import in `addon/components/froala-editor.js`
3. `npm version x.y.z` - Updates the version in `package.json` and tags in git
4. `git push origin master --follow-tags` - Pushes any changes and the new version tag up to Github
5. Update the new tag on the [Github Releases page](https://github.com/froala/ember-froala-editor/releases)
6. TBD - Update Docs
7. `npm publish` - Release the new version to the world!

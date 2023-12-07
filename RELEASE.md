# Release Process

1. `pnpm install froala-editor@x.y.z --save` - Updates the editor dependency and lock-file to the specific version
2. `npm version x.y.z` - Updates the version in `package.json` and tags in git
3. `git push origin master --follow-tags` - Pushes any changes and the new version tag up to Github
4. Update the new tag on the [Github Releases page](https://github.com/froala/ember-froala-editor/releases)
5. TBD - Update Docs
6. `npm publish` - Release the new version to the world!

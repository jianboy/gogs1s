# @jianboy/vscode-web

This is the companion NPM package to support Gogs1s. The NPM package is [@jianboy/vscode-web](https://www.npmjs.com/package/@jianboy/vscode-web).

## Commands

`yarn clone` - clone the official VS Code repo.

`yarn build` - build the VS Code with the custom code under `src`.

`yarn watch` - watch the code change under `src` directory and rebuild VS Code.

## Local development

There are two ways to do local development with GitHub1s. For feature development, you could use the `yarn watch-with-vscode` under the root directory.

To verify the NPM package content itself before publish. You need to install the [yalc](https://github.com/wclr/yalc) first (`yarn global add yalc`).

Then run the following commands:

```sh
cd gogs1s
yarn build:vscode # Build the VS Code
yarn yalc # Install local package via yalc

yarn build # Build the Gogs1s & other extensions
yarn serve
```

And visit the http://localhost:5000 to verify the change. Please revert any changes related to `yalc` before commit, i.e. the `package.json`, the `.yalc/` and `yalc.lock` files.

## Publish

To publish the NPM package, please make sure you have the right access via https://www.npmjs.com/ and run the following commands:

```sh
cd gogs1s
cd vscode-web-gogs1s
yarn build
# bump the `version` field in vscode-web-gogs1s/package.json file.
npm publish --access public
```

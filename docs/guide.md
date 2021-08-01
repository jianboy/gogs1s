# How it works

gogs1s 灵感来源于 Github1s，基于 gogs 版本管理系统开发，实现 gogs 系统预览代码功能。

Github1s is based on [VS Code 1.52.1](https://github.com/microsoft/vscode/tree/1.52.1) now. VS Code can be built for a browser version officially. I also used the code and got inspired by [Code Server](https://github.com/cdr/code-server).

Thanks to the very powerful and flexible extensibility of VS Code, we can easily implement a VS Code extension that provides the custom File IO ability using [FileSystemProvider API](https://code.visualstudio.com/api/references/vscode-api#FileSystemProvider). There is an official demo named [vscode-web-playground](https://github.com/microsoft/vscode-web-playground) which shows how it is used.

On the other hand, GitHub provides the powerful [REST API](https://docs.github.com/en/rest) that can be used for a variety of tasks which includes reading directories and files for sure.

According to the above, obviously, the core concept of GitHub1s is to implement a VS Code Extension (includes FileSystemProvider) using GitHub REST API.

*We may switch to the GitHub GraphQL API for more friendly user experience in the future, thanks to @xcv58 and @kanhegaonkarsaurabh. See details at [Issue 12](https://github.com/conwnet/github1s/issues/12).*

GitHub1s is a purely static web app (because it really doesn't need a backend service, does it?). So we just deploy it on [GitHub Pages](https://pages.github.com/) now (the `gh-pages` branch of this repository), and it is free. The service of GitHub1s could be reliable (GitHub is very reliable) because nobody needs to pay the web hosting bills.


# Development

先安装：
apt update
apt install rsync
apt install -y g++ gcc make python2.7 pkg-config libx11-dev libxkbfile-dev libsecret-1-dev

apt-get install build-essential

scripts/postinstall.sh

	git clone --depth 1 -b 1.52.1 https://hub.fastgit.org/microsoft/vscode.git vscode


执行：

```shell
$ yarn
$ yarn watch # or yarn build, it may take minutes, wait please
```

Then, there will be a new directory named `dist` generated in the project root. You can run `yarn serve` in another shell, and it will create a static file server for the `dist` directory.

Now you can visit http://localhost:5000 in the browser. If you get a 404 error for some static files, please wait a minute for the building to complete.

## Watch Mode

What happens after you run `yarn watch`?

1. Copy some necessary resources (`index.html`, extensions config, libraries, etc.) to the `dist` directory.

2. Go to `lib/vscode` and run `yarn gulp compile-web` to build the necessary extensions, then copy it to the `dist/extensions` directory.

3. Go to `lib/vscode` and run `yarn watch` (the native watch of vscode), it will trigger a new build if something in it has been changed.

4. Watch the `src` directory, merge it in to `lib/vscode/src` if something in it has been changed. (When a new file is merged into `lib/vscode/src`, it will trigger the watcher that is described in Step 3)

5. Go to `extensions/github1s` and run `yarn watch`, it will trigger a new build if something has been changed.

6. Watch the `extensions` directory and the `lib/vscode/out` directory, merge them into the `dist` directory if something changed in them.

Note that since we have modified the source code of VS Code, it may get into trouble when merging a newer version VS Code.

It is a little laborious to complete the watch process, but I didn't think of a better solution.

## Build mode

Put simply, we build the necessary code and do a minify. The minify script is modified from [Code Server](https://github.com/cdr/code-server).

## Directory Structure

- `extensions` - custom VS Code extensions that don't come with VS Code natively.

- `src` - the code in here will be patched into VS Code source.

- `scripts` - some scripts for build, watch, package, etc.

- `resources` - some resource files such as templates, pictures, configuration files, etc.

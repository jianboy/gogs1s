#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${0}")/.."
APP_ROOT=$(pwd)
echo $APP_ROOT

# build vscode source and vscode builtin extensions
function main() {
	cd ${APP_ROOT}
	# rsync -a resources/gulp-gogs1s.js lib/vscode
	cd lib/vscode
	yarn gulp vscode-web-min
	# yarn gulp compile-build
	# yarn gulp optimize --gulpfile ./gulp-gogs1s.js
	# yarn gulp minify --gulpfile ./gulp-gogs1s.js

	echo "build vscode done!"
}

main "$@"

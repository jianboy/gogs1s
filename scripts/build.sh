#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${0}")/.."
APP_ROOT=$(pwd)
export IS_BUILD="true"

# execute all necessary tasks
function main() {
	rm -rf "${APP_ROOT}/dist"
	cd "${APP_ROOT}/scripts"
	./build/build-gogs1s-extensions.sh
	./package.sh

	echo "all build done!"
}

main "$@"
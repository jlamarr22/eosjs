#!/bin/bash
set -eo pipefail

npm i -g npm@6.13.6
yarn global add typescript
yarn global add webpack
echo "node $(node --version)"
echo "npm $(npm --version)"
echo "yarn $(yarn --version)"

exit 0
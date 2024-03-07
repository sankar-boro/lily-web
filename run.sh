#!/usr/bin/env sh

MODE=dev
echo "Running $MODE mode."
webpack serve --config ./config/webpack.config.js --env env=dev HOST=localhost PORT=5000
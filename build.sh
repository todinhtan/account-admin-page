#!/bin/bash

rm -rf dist && mkdir dist
npx babel . --out-dir dist --copy-dot-files --ignore ./node_modules
cp ./package.json dist
cp ./.env dist
cp -R ./views ./dist
cd dist && npm install --production
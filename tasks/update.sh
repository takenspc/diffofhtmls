#!/bin/bash

rm -rf generator
mkdir generator

git clone --depth 1 https://github.com/takenspc/diffofhtmlsgenerator.git generator

pushd generator
npm install
npm install typescript
npm run build
npm start

#!/bin/bash

# rm -rf is slow
mkdir -p generator
mv generator generator_

git clone --depth 1 https://github.com/takenspc/diffofhtmlsgenerator.git generator

pushd generator
npm install
npm run build
npm start

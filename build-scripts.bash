#! /bin/bash -xue

DIST_DIR=dist
mkdir -p $DIST_DIR

# Build hello-world-comment
cd hello-world-comment
npm ci
npm run all
cd ..
cp hello-world-comment/dist/index.js $DIST_DIR/hello-world-comment.js

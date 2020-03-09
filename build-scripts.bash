#! /bin/bash -xue

DIST_DIR=dist
mkdir -p $DIST_DIR

# Build hello-world-comment
NAME=hello-world-comment
cd $NAME
npm ci
npm run all
cd ..
cp $NAME/dist/index.js $DIST_DIR/$NAME.js

# Build merge-preview
NAME=merge-preview
cd $NAME
npm ci
npm run all
cd ..
cp $NAME/dist/index.js $DIST_DIR/$NAME.js

# Build update-all-npm-packages
NAME=update-all-npm-packages
cd $NAME
npm ci
npm run all
cd ..
cp $NAME/dist/index.js $DIST_DIR/$NAME.js

# Create index.html for visitors to top page
cd $DIST_DIR
echo "<ul>" > "index.html"
for fname in $(find . -type f); do
  echo "  <li><a href="$fname">$fname</a></li>" >> "index.html"
done
echo "</ul>" >> "index.html"
cd ..

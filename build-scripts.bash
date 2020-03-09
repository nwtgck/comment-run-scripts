#! /bin/bash -xue

DIST_DIR=dist
mkdir -p $DIST_DIR

# Build hello-world-comment
cd hello-world-comment
npm ci
npm run all
cd ..
cp hello-world-comment/dist/index.js $DIST_DIR/hello-world-comment.js

# Create index.html for visitors to top page
cd $DIST_DIR
echo "<ul>" > "index.html"
for fname in $(find . -type f); do
  echo "  <li><a href="$fname">$fname</a></li>" >> "index.html"
done
echo "</ul>" >> "index.html"
cd ..

#!/bin/bash

OUT_DIR=$1
BUNDLE_DIR="./dist/bundle"

echo "Bundle Versioning..."
echo "Bundle dir: $BUNDLE_DIR"
echo "Out dir: $OUT_DIR"
echo ""

# gets the current version and its major and minor versions
VERSION=$(node -p -e "require('./package.json').version")
MINOR=${VERSION%.*}
MAJOR=${MINOR%.*}

LATEST_DIR="$OUT_DIR/latest"
VERSION_DIR="$OUT_DIR/$VERSION"
MINOR_DIR="$OUT_DIR/$MINOR"
MAJOR_DIR="$OUT_DIR/$MAJOR"

# latest/
echo "Latest: $LATEST_DIR"
rm -rf $LATEST_DIR
mkdir -p $LATEST_DIR
cp -a "$BUNDLE_DIR/." $LATEST_DIR

# x/
echo "Major $MAJOR_DIR"
rm -rf $MAJOR_DIR
mkdir -p $MAJOR_DIR
cp -a "$BUNDLE_DIR/." $MAJOR_DIR

# x.x/
echo "Minor: $MINOR_DIR"
rm -rf $MINOR_DIR
mkdir -p $MINOR_DIR
cp -a "$BUNDLE_DIR/." $MINOR_DIR

# x.x.x/
echo "Version $VERSION_DIR"
rm -rf $VERSION_DIR
mkdir -p $VERSION_DIR
cp -a "$BUNDLE_DIR/." $VERSION_DIR

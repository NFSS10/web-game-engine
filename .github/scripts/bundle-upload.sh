#!/bin/bash

ARTIFACTS_DIR=$1
GITHUB_EMAIL=$2
GITHUB_USERNAME=$3
GITHUB_TOKEN=$4
GITHUB_REPO=$5
BUNDLES_PATH=$6

VERSION=$(node -p -e "require('./package.json').version")
MINOR=${VERSION%.*}
MAJOR=${MINOR%.*}

echo "\nCloning CDN repository..."
git clone -n --depth=1 --filter=tree:0 https://$GITHUB_TOKEN@github.com/$GITHUB_REPO.git cdn
cd cdn
git sparse-checkout set --no-cone $BUNDLES_PATH
git checkout

echo "\nEnsuring versions are cleanly updated..."
rm -rf $BUNDLES_PATH/latest # /latest/
rm -rf $BUNDLES_PATH/$MAJOR # /x/
rm -rf $BUNDLES_PATH/$MINOR # /x.x/

echo "\nCreating new branch..."
BRANCH_NAME="bot/bundle-web-game-engine-$VERSION"
git checkout -b $BRANCH_NAME

echo "\nCopying artifacts..."
mkdir -p $BUNDLES_PATH
cp -a "../$ARTIFACTS_DIR/." $BUNDLES_PATH

echo "\nCommitting changes..."
git config user.email "$GITHUB_EMAIL"
git config user.name "$GITHUB_USERNAME"
cd $BUNDLES_PATH
git status
git add .
git commit -m "bundle: web-game-engine "$VERSION""
git push --set-upstream origin $BRANCH_NAME

echo "\nMerging $BRANCH_NAME branch..."
git sparse-checkout set --no-cone $BUNDLES_PATH
git checkout master
git merge $BRANCH_NAME
git push origin master

echo "\nCleaning up..."
git push origin -d $BRANCH_NAME

echo "\nUpload finished!"

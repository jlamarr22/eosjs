#!/bin/bash

setup_git() {
  # Set the user name and email to match the API token holder
  # This will make sure the git commits will have the correct photo
  # and the user gets the credit for a checkin
  git config --global user.email "devops@block.one"
  git config --global user.name "blockone-devops"
  git config --global push.default matching
  
  # Get the credentials from a file
  git config credential.helper "store --file=.git/credentials"
  
  # This associates the API Key with the account
  echo "https://${GITHUB_API_KEY}:@github.com" > .git/credentials
}

ensure_version_match() {
  VERSION="v$(cat package.json | grep version | cut -f2 -d ":" | tr -d '",\ ')"
  TAG="$(echo $GITHUB_REF | grep tags | cut -f3 -d'/')"
  echo "version: $VERSION"
  echo "tag: $TAG"
  [[ "$VERSION" == "$TEST" ]] && echo "Versions match." || exit 1
}
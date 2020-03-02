#!/bin/bash

setup_git() {
  # Set the user name and email to perform a commit locally. No changes are pushed.
  git config --global user.email "user@email.com"
  git config --global user.name "username"
}

ensure_version_match() {
  echo "ensure_version_match"
  VERSION="v$(cat package.json | grep version | cut -f2 -d ":" | tr -d '",\ ')"
  echo "VERSION: ${VERSION}";
  TAG="$(echo $GITHUB_REF | grep tags | cut -f3 -d'/')"
  echo "TAG: ${TAG}";
  [[ "$VERSION" == "$TAG" ]] && echo "Versions match." || exit 1
}

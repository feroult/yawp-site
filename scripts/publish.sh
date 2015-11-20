#!/bin/bash
jekyll b
git commit -am "publishing"
git push
git subtree push --prefix _site origin gh-pages

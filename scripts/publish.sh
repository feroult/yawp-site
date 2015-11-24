#!/bin/bash
jekyll b
sed -i '' -e 's/\.html//g' _site/sitemap.xml
sed -i '' -e 's/\<loc\>/\<loc\>http:\/\/yawp.io/g' sitemap.xml
git add .
git commit -am "publishing"
git push
git subtree push --prefix _site origin gh-pages

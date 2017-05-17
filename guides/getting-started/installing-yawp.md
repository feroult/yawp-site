---
layout: guides
title: "Getting Started: Installing YAWP!"
description: A guide on how to install the YAWP! framework
---
# Installing YAWP!

The prerequisites to install __YAWP__ are:

 * Java SDK 1.7 or greater
 * Maven 3.3 or greater

The easiest way to install it is by using its Maven archetype.
You may change the values of the __groupId__, __artifactId__ and __version__ variables:

~~~ bash
mvn archetype:generate \
   -DarchetypeGroupId=io.yawp \
   -DarchetypeArtifactId=yawp \
   -DarchetypeVersion=LATEST \
   -DgroupId=yawpapp \
   -DartifactId=yawpapp \
   -Dversion=1.0-SNAPSHOT
~~~

After that, you can cd into the __yawpapp__ folder and start the development server:

~~~ bash
cd yawpapp
mvn yawp:devserver
~~~

Just point a web browser to [http://localhost:8080/api](http://localhost:8080/api/) to verify it.

Finally, if you want to deploy your API to __Google App Engine__, just follow this
[simple guide](google-appengine-deploy).

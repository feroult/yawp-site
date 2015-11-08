---
layout: guides
---
# Installing YAWP!

The prerequisites to install __YAWP__ are:

 * Java SDK 1.7 or greater
 * Maven 3.0 or greater

The easiest way to install it is using its maven archetype.
You may change the values of the __groupId__, __artifactId__ and __version__ variables:

~~~ bash
mvn archetype:generate \
   -DarchetypeGroupId=io.yawp \
   -DarchetypeArtifactId=yawp \
   -DarchetypeVersion=LATEST \
   -DgroupdId=yawp-app \
   -DartifactId=yawp-app \
   -Dversion=1.0-SNAPSHOT
~~~

After that, you can cd into the __yawp-app__ folder and start the development server:

~~~ bash
cd yawp-app
mvn yawp:devserver
~~~

Just point a web browser to [http://localhost:8080/api/people](http://localhost:8080/api/people) to test if the sample endpoint is responding.
---
layout: blog
---

Starting with version **1.4.0**, to be released in a few days, YAWP! will enforce
more strictly the [semantic versioning](http://semver.org) scheme to indicate how 
changes affects its API.

Actually, you probably have had no problems so far, because we've been using a model 
very similar with only few differences.

<!--more-->

Anyway, by doing this, it is safer for developers to decide whenever or not 
upgrade to new versions of the framework without causing problems to existing apps. 

If you are not familiar with the model, it is really straightforward. Here is the 
introduction extracted from its website:

~~~ java
Given a version number MAJOR.MINOR.PATCH, increment the:

MAJOR version when you make incompatible API changes,
MINOR version when you add functionality in a backwards-compatible manner, and
PATCH version when you make backwards-compatible bug fixes.
~~~

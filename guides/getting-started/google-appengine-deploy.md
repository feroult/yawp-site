---
layout: guides
title: "Google Appengine Deploy"
description: A guide on how to deploy YAWP! to Google Appengine
---
# Google Appengine Deploy

After you've bootstrapped your API with the ad of the YAWP!'s maven archetype, it is
really straight forward to deploy it to Google Appengine, just follow these steps:

1) Create your Appengine Project ID using the [Google Clound Console](https://console.cloud.google.com).

2) Change the file __src/main/webapp/WEB-IF/appengine-web.xml__ and insert your Project ID:

~~~ xml
<application>YOUR_APPENGINE_PROJECT_ID</application>
~~~

3) From the project's root folder, deploy your APP using the Appengine Maven Plugin:

~~~ bash
mvn appengine:update
~~~

4) Try it with cURL:

~~~ bash
$ curl http://YOUR_APPENGINE_PROJECT_ID.appspot.com/api
~~~

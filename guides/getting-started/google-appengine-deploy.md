---
layout: guides
title: "Google App Engine Deploy"
description: A guide on how to deploy YAWP! to Google App Engine
---
# Google App Engine Deploy

After you've bootstrapped your API with the aid of YAWP!'s Maven archetype, it is
really straightforward to deploy it to Google App Engine. Just follow these steps:

1) Create your App Engine Project ID using [Google Cloud Console](https://console.cloud.google.com).

2) Change the file __src/main/webapp/WEB-IF/appengine-web.xml__ and insert your Project ID:

~~~ xml
<application>YOUR_APPENGINE_PROJECT_ID</application>
~~~

3) From the project's root folder, deploy your app using the App Engine Maven plugin:

~~~ bash
mvn appengine:update
~~~

4) Test it with cURL:

~~~ bash
$ curl http://YOUR_APPENGINE_PROJECT_ID.appspot.com/api
~~~

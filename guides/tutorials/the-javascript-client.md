---
layout: guides
---
# Javascript Client

To access __YAWP!__ APIs from you web apps, you can use its javascript client library.

### Installation

~~~ html
<script src="https://rawgit.com/feroult/yawp/master/yawp-core/src/main/js/yawp.js"></script>
~~~ 

_Consider adding yawp.js to your own static files folder._

### Setup

By default the client routes all API calls to the path __/api__ of the current app's host.
You can override this setting as following:

~~~ javascript
yawp.config(function (c) {
    c.baseUrl('http://your-cors-host.com/api');
});
~~~

### Repository Actions
~~~ javascript
// create
yawp('/people').create({ name: 'janes' }).done(function (person) {
    console.log(person)
});

// update
yawp('/people/1').update({ name: 'janes' }).done(function (person) {
    console.log(person)
});

// patch
yawp('/people/1').patch({ name: 'janes' }).done(function (person) {
    console.log(person)
});

// destroy
yawp('/people/1').destroy().done(function (id) {
    console.log(id)
});

// fetch
yawp('/people/1').fetch(function (person) {
    console.log(person)
});

// list
yawp('/people').list(function (person) {
    console.log(person)
});
~~~


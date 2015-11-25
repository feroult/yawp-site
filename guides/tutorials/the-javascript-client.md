---
layout: guides
title: "Tutorials: The Javascript client"
description: A guide on how to use the YAWP!'s Javascript client
---
# The Javascript client

To access __YAWP!__ APIs from your web apps, you can use its javascript client library.

### Contents

- [Installation](#installation)
- [Setup](#setup)
- [Repository Actions](#repository-actions)
- [Custom Actions](#custom-actions)
- [Query](#query)
- [Transformers](#transformers)

### Installation

~~~ html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="https://rawgit.com/feroult/yawp/yawp-1.3.8/yawp-core/src/main/js/yawp.js"></script>
~~~ 

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
    console.log(person);
});

// update
yawp('/people/1').update({ name: 'janes' }).done(function (person) {
    console.log(person);
});

// patch
yawp('/people/1').patch({ name: 'janes' }).done(function (person) {
    console.log(person);
});

// destroy
yawp('/people/1').destroy().done(function (id) {
    console.log(id);
});

// fetch
yawp('/people/1').fetch(function (person) {
    console.log(person);
});

// list
yawp('/people').list(function (people) {
    console.log(people);
});
~~~

### Custom Actions

~~~ javascript
// @GET("me") over collection action 
yawp('/people').get('me').done(function (person) {
    console.log(person);
});

// @PUT("reverse-name") single entity action
yawp('/people/1').put('reverse-name').done(function (person) {
    console.log(person);
});
~~~

### Query 

~~~ javascript
// where + list
yawp('/people').where(['name', '=', 'janes']).list(function (people) {
    console.log(people);
});

// where + first
yawp('/people').where(['name', '=', 'janes']).first(function (person) {
    console.log(person);
});

// limit
yawp('/people').where(['name', '=', 'janes']).limit(10).list(function (people) {
    console.log(people);
});

// order
yawp('/people').where(['name', '=', 'janes']).order([{ p: 'name', d: 'asc'}])
               .list(function (people) {
    console.log(people);
});
~~~

### Transfomers

~~~ javascript
// transform + where + list
yawp('/people').transform('upperCase').where(['name', '=', 'janes']).list(function (people) {
    console.log(people);
});

// transform + first
yawp('/people').transform('upperCase').first(function (person) {
    console.log(person);
});
~~~


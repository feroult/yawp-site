---
layout: guides
title: "Getting Started: Introduction"
description: Introduction to the YAWP! Framework
---
# Introduction

__YAWP!__ is a lightweight REST API framework focused on productivity and scalability. 

It is first targeted to run on Google Cloud Platform, levaraging its power by seamlessly
integrating different cloud APIs into a single and concise web framework.

The __server side__ is written in Java and works on Google Appengine. 
The __client side__ is written in Javascript and works on Node.js or a browser. 

Contributors are always welcome, the source code is at [github.com/feroult/yawp](http://github.com/feroult/yawp)

Below, a quick overview of its usage and features.

____

## Short Example

Everything happens around a plain Java object:

~~~ java
@Endpoint(path = "/people")
public class Person {
    @Id
    IdRef<Person> id;             
    String name;
}   
~~~

Then you we access it from Javascript:

~~~ javascript
var yawp = require('yawp');

var promise = yawp('/people').create({name: 'janes'}).then(function(person) {
    console.log('created', person.id);

    person.name = 'janes joplin';
    return person.save(function() {
        console.log('updated');
    });
});
~~~

And then we can customize it with the extra features below.

## Core Features

__Server Side:__

* [Automatic CRUD routes](/guides/api/repository-actions)
* [Query API](/guides/api/query)
* [Custom Action Routes](/guides/api/actions)
* [Transformers](/guides/api/transformers)
* [Security Shields](/guides/api/shields)
* [Model Hooks](/guides/api/hooks)
* [Asynchronous Pipes](/guides/api/pipes)
* [Google Appengine support](/guides/getting-started/google-appengine-deploy)
* [PostgreSQL JsonB support (manual scaling)](/guides/getting-started/supported-platforms) 

__Client Side:__

* [Fluent API](/guides/tutorials/the-javascript-client)
* [Easy access to all server APIs](/guides/tutorials/the-javascript-client)
* [ES6 Promises](/guides/tutorials/the-javascript-client)
* [ES6 class extension](/guides/tutorials/the-javascript-client)




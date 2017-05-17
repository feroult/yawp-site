---
layout: guides
title: "Getting Started: Introduction"
description: Introduction to the YAWP! Framework
---
# Introduction

__YAWP!__ is a lightweight REST API framework focused on productivity and scalability. 

It is primarily targeted at running in __Google Cloud Platform__. It leverages its power by the seamless
integration of different cloud APIs into a simple web framework.

The __server side__ is written in Java and works in Google App Engine. 
The __client side__ is written in JavaScript and works in Node.js or in the browser. 

Contributors are always welcome, the source code is at [github.com/feroult/yawp](http://github.com/feroult/yawp).

Below is a quick overview of its usage and features.

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

Then, we can access it from JavaScript:

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

And, finally, we can customize it with the extra features below.

## Core Features

__Server Side:__

* [Automatic CRUD Routes](/guides/api/repository-actions)
* [Query API](/guides/api/query)
* [Custom Action Routes](/guides/api/actions)
* [Transformers](/guides/api/transformers)
* [Security Shields](/guides/api/shields)
* [Model Hooks](/guides/api/hooks)
* [Asynchronous Pipes](/guides/api/pipes)
* [Google App Engine support](/guides/getting-started/google-appengine-deploy)
* [PostgreSQL JSONB support (manual scaling)](/guides/getting-started/supported-platforms) 

__Client Side:__

* [Fluent API](/guides/tutorials/the-javascript-client)
* [Easy access to all server APIs](/guides/tutorials/the-javascript-client)
* [ES6 Promises](/guides/tutorials/the-javascript-client)
* [ES6 Class extension](/guides/tutorials/the-javascript-client)




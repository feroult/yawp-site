---
layout: guides
title: "Getting Started: Core concepts"
description: An overview of the core concepts of the YAWP! framework
---
# Core concepts

The main objective of __YAWP!__ is to help developers to create simple, elegant and
powerful web APIs.

### Endpoint Models

In the center of everything are the [__Endpoint Models__](/guides/api/models). More precisely, they are __Active Web Documents__:

 * __Active__: Because they can be extended with custom actions, transformations, interceptions and security;

 * __Web__: Because everything you write gets exposed as fluent Web APIs;

 * __Documents__: Because they are backed by schemaless datastore repositories.

Endpoint Models are really easy to create. The simplest example, used almost everywhere in this
documentation, is the __Person__ Endpoint Model:

~~~ java
@Endpoint(path = "/people")
public class Person {
    @Id
    IdRef<Person> id;
    String name;
}
~~~

This is the only configuration needed to create the __Person__ Endpoint Model, which by default gives
you repository actions with a complete set of Web APIs to access them:

| Verb        | Path           | Action                |
| ----------- |--------------- | --------------------- |
| GET         | /people        | List people           |
| POST        | /people        | Create a person       |
| GET         | /people/{id}   | Show a person         |
| PUT/PATCH   | /people/{id}   | Update a person       |
| DELETE      | /people/{id}   | Destroy a person      |

### Endpoint Features

The default REST repository can be extended with custom business logic and this is done by means
of extending a set of APIs known as __Endpoint Features__. They were carefully selected
to organize specific responsibilities together:

 * __Repository Actions__: Out of the box you get actions to create, query, update and destroy your models'
    entities. It is also possible to disable anything you want with the help of shields;

 * __Custom Actions__: This is the place to put custom business logic that is responsible for changing the internal
    state of your models;

 * __Transformers__: Used to customize different views of the same model entity;

 * __Shields__: A complete set of features to add security to your endpoints. You can protect routes
    individually or by groups, based on user information or the contents of your models;

 * __Hooks__: A way to intercept the life-cycle of your models and add custom logic where necessary.

 * __Pipes__: Create aggregated views (joins) of your models' information.

### Statically Typed over a Schemaless Persistence Layer

We've selected Java as the core language of __YAWP!__ because it is statically typed at compile time.
The main idea is to have an explicit and well organized place to declare your models' structure.
Since we are working over a schemaless persistence layer, this setup can be very powerful, mixing
flexibility and stability.

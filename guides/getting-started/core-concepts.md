---
layout: guides
---
# Core concepts

The main objective of __YAWP!__ is to help developers to create simple, elegant and
powerful web APIs. 

### Endpoint Models

In the center of everything are the __Endpoint Models__. More precisely, they are __Active Web Documents__:
 
 * __Active__: Because they can be extended with custom actions, transformations, interceptions and security;
 
 * __Web__: Beause everything you write gets exposed as fluent web APIs;
 
 * __Documents__: Because they are backed by schemaless datastore repositories.
  
Endpoint models are really easy to create. The simplest example used almost everywhere in this
documentation is the Person endpoint:

~~~ java
@Endpoint(path = "/people")
public class Person

    (...)
~~~

This is the only configuration needed to create the __Person__ endpoint model which by default gives 
you the repository with a complete set of web APIs to access it:

| Verb        | Path           | Action                |
| ----------- |--------------- | --------------------- |
| GET         | /people        | List people           |
| POST        | /people        | Create a person       |
| GET         | /people/{id}   | Show a person         |
| PUT/PATCH   | /people/{id}   | Update a person       |
| DELETE      | /people/{id}   | Destroy a person      |

### Endpoint Features

The default rest repository can be extended with custom business logic and this is done by means 
of extending  a set of APIs known as __Endpoint Features__. They were carefully selected 
to organize specific responsabilities together:

 * Actions
 * Transfomers
 * Shields
 * Hooks
 
 








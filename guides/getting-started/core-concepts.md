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

 * __Repository Actions__: Out of the box you get actions to create, query, update and delete your models. 
    It is also possible to disable anything you want with the help of shields;
 
 * __Custom Actions__: This is the place put custom business logic that are responsible to change the internal
    state of your models;
 
 * __Transfomers__: To customize different views of the same model; 
 
 * __Shields__: A complete set of features to add security to your endpoints. You can protected a group or 
    individual routes, based on user information or the contents of your models;
 
 * __Hooks__: A way to intercep the lifecycle of your models to add custom logic where necessary.
 
### Static Typed over a Schemaless Persistence Layer

We've selected Java as the core language of __YAWP!__ because it is static typed at the compile time. 
The main idea is to have a explicity and well organized place to declare your models structure. 
Since we are working over a schemaless persistence layer this setup can be very powerful, mixing
flexibility and stability.










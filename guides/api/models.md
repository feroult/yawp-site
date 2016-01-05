---
layout: guides
title: "API: Models"
description: Guides for the Models API with java code samples
---
# Models

Endpoint Models represent the schema of your API resources. Lets take look at some important points
of our Person endpoint example:

~~~ java
@Endpoint(path = "/people")
public class Person {

    @Id
    IdRef<Person> id;

    @Index
    String name;

}
~~~

### @Endpoint

The beginning of everything is the __@Endpoint__ annotation. It defines a new endpoint and the base route
of its APIs to be __/people__.

### Primitive Properties

The primitive types that can be used as models attributes are describe in the following table. More complex
types can be persisted using the __@Json__ annotation:

| Type                  | Java type(s)    
| --------------------- |---------------------------------------------------------------------------
| Integer               | short, int, long, java.lang.Short, java.lang.Integer, java.lang.Long       
| Floating-point number | float, double, java.lang.Float, java.lang.Double
| Boolean               | boolean, java.lang.Boolean
| Text                  | String
| Date                  | java.util.Date

### @Id

All models should have one, and only one, __IdRef__ attribute annotaded with __@Id__. This is
the id of your model and it will be used to access its information or to create a relationship
with another model.

### @Index

The __@Index__ annotation tells yawp to create indexes to allow queries using this
attribute as a filter or order clause.


### @Json

If you want store a more complex object inside your model, you will need to serialize
the attribute as a json string. For instance:

~~~ java
@Json
Address address;
~~~

### @Text

It is used to mark a string attribute as a large text value. When you use this annotation you can store
larger texts but you can't create indexes over this attribute anymore.

~~~ java
@Text
String comment;
~~~


### @ParentId

It is possible to create entity groups based on ancestor keys. In Appengine Datastore this is used
to obtain strong consistency queries where it is necessary. To do so, you add an IdRef to the ancestor
model of your model, annotate it with __@ParentId__:


~~~ java
@ParentId
IdRef<Company> companyId;
~~~

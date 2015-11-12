---
layout: guides
---
# Models

Endpoit Models represent the schema of your API resources. Lets take look at some important points
of our Person endpoint example:

~~~ java
@Endpoint(path = "/people")
public class Person {

    @Id
    private IdRef<Person> id;

    @Index
    private String name;

    (...)
~~~

### @Endpoint

The beginning of everything is the __@Endpoint__ annotation. It defines a new endpoint and the base route
of its APIs to be __/people__.

### @Id

All models should to have one, and only one, __IdRef__ attribute annotaded with __@Id__. This is
the id of your model and it will be used to access your its information or to create a relationship
with another model.

### @Index

Then you have the __string name__ attribute. It is self explanatory, this attribute is used to store the name
of a given person. The __@Index__ annotation tells yawp to create indexes to allow queries using this
attribute as a filter or order clause.


### @Json

Lets say you want store a more complex information inside your model. You serialize the attribute as
a json string, all you need to do is to mark it, for example:

~~~ java
@Json
private Address address;
~~~

### @ParentId

It is possible to create entity groups based on ancestor keys. In Appengine Datastore this is used
to obtain strong consistency queries where it is necessary. To do so, you add an IdRef to the ancestor
model of your model, annotate it with __@ParentId__:


~~~ java
@ParentId
private IdRef<Company> companyId;
~~~
---
layout: guides
title: "API: Query"
description: Guides for the Query API with java and javascript code samples
---
# Query

From a http/json call, a [java](/guides/tutorials/the-java-client) or 
[javascript](/guides/tutorials/the-javascript-client) method you can query your entities using a fluent 
API that nicely exposes the Datastore Query class.

__Javascript__:

~~~ javascript
yawp('/people').where([ 'name', '=', 'Janes']).first( function(person) {} );

yawp('/people').order([ { p: 'name', d: 'desc' } ]).list( function(people) {} );

yawp('/people').from(parentId).list( function(people) {} );
~~~

__Java__:

~~~ java
Person person = yawp(Person.class).where("name", "=", "Janes").first();

List<Person> people = yawp(Person.class).order("name", "desc").list();

List<Person> people = yawp(Person.class).from(parentId).list();
~~~

Other Java examples, also available from http/json or Javascript:

~~~ java
yawp(Person.class).where("name", "=", "Mark").and("age", ">=", 21).list();

yawp(Person.class).where(or(and(c("company", "=", "github.com"), c("age", ">=", 21)), and(c("company", "=", "YAWP!"), c("age", ">=", 18)))).ids();

yawp(Person.class).where("name", "=", "John").and("company", "=", "github.com").only();
~~~

Note: The methods __c__, __and__ and __or__ must be static imported or fully qualified.

You can look at this [Java test suite](http://github.com/feroult/yawp/tree/master/src/test/java/io/yawp/repository/query/DatastoreQueryTest.java) 
to see examples of more complex constructions.
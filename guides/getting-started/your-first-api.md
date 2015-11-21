---
layout: guides
---
# Your First API

Good news are that if you've installed __YAWP!__ from the maven archetype, you already have
your first API running.

To create a new API you just need to create an [Endpoint](/guides/api/models). It is done very
easily with a scaffold:

~~~ bash
mvn yawp:endpoint -Dmodel=person
~~~

If you prefer, you can create it manually wich is also very simple:

~~~ java
@Endpoint(path = "/people")
public class Person {

    private IdRef<Person> id;
    
    private String name;
    
}
~~~

Now, start the development server:

~~~ bash
mvn yawp:devserver
~~~

After the development server starts you can play with the __Person__ endpoint APIs with cURL, to create a person,
execute in a shell:

~~~ bash
curl -H "Content-type: application/json" -X POST \
     -d "{'name': 'John'}" http://localhost:8080/api/people
~~~

To retrieve the created document, run:

~~~ bash
curl http://localhost:8080/api/people
~~~

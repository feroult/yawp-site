---
layout: guides
---
# Your First API

Good news are that if you've installed __YAWP!__ from the maven archetype, you already have
your first API running.

To create a new API you just need to create an [Endpoint](todo link), like the one that ships 
within the archetype:

~~~ java
@Endpoint(path = "/people")
public class Person {

	@Id
	private IdRef<Person> id;

	@Index
	private String name;

	public IdRef<Person> getId() {
		return id;
	}

	public void setId(IdRef<Person> id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
~~~

If it is not already running, start the development server:

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

You may have noticed that we've annotated the __name__ attribute of the Person endpoint with __@Index__. 
That means we can query this endpoint using the attribute as a filter. In the next sections we will cover this 
and other important features.

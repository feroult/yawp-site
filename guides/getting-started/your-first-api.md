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

After the development server starts, __YAWP!__ will load your endpoint configuration and will create the default rest routes
for the Person endpoint, which are:

| Verb        | Path           | Action                |
| ----------- |--------------- | --------------------- |
| GET         | /people        | List people           |
| POST        | /people        | Create a person       |
| GET         | /people/{id}   | Show a person         |
| PUT/PATCH   | /people/{id}   | Update a person       |
| DELETE      | /people/{id}   | Destroy a person      |

You can play with those APIs with cURL, to create a person with name Janes, run:

~~~ bash
curl -H "Content-type: application/json" -X POST \
     -d "{'name': 'Janes'}" http://localhost:8080/api/people
~~~

To retrieve the created document, run:

~~~ bash
curl http://localhost:8080/api/people
~~~



---
layout: guides
---
# Actions

To add custom behavior to your domain object you can use the Action API. Imagine you need to 
activate a given person. To do this you can create an Action class:

### Single Entity

~~~ java
public class ActivatePersonAction extends Action<Person> {

    @PUT("active")
    public void activate(IdRef<Person> id) {
        Person person = id.fetch();
        person.setActive(true);
        yawp.save(person);
    }

}
~~~

Now, to activate a given person, let's say with id 123, we can run:

~~~ bash
curl -X PUT http://localhost:8080/api/people/123/active
~~~

Now, to do the samething in __Javascript__:

~~~ javascript
yawp('/people/123').put('active').done( function(status) {} );
~~~

### Over Collection

Also, an action be called over a single entity or over a collection. For an action over a collection, 
don't specify an IdRef argument in the method signature.

Note that you can specify an IdRef only if you are targeting a __@ParentId IdRef__. In that case, it will
be an action over collection for all children of that __@ParentId__.

~~~ java
public class PersonAction extends Action<Person> {
    // over collection without IdRef
    @GET("me")
    public Person me() {
        return SessionManager.getLoggedPerson(yawp);
    }

    // over collection with parent IdRef
    @GET("first")
    public Person first(IdRef<Company> companyId) {
      return yawp(Person.class).from(companyId).first();
    }
}
~~~

The following routes will be created and mapped to your methods:

  * GET /users/me -> call the action me()
  * GET /company/{companyId}/users/firstChild -> call the action firstUser()
  
### Request Parameters

If you want to access the request parameters inside your actions, just add, as the last argument 
in the method signature, a __Map<String, String>__:

~~~ java
public class PersonAction extends Action<Person> {
    // single entity
    @GET("params1")
    public Person me(IdRef<Person> id, Map<String, String> params) {
        // ...
    }

    // over collection
    @GET("params2")
    public Person me(Map<String, String> params) {
        // ...
    }

    // over collection with parent IdRef
    @GET("params3")
    public Person first(IdRef<Company> companyId  Map<String, String> params) {
        // ...
    }
}
~~~

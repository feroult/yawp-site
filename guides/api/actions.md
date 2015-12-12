---
layout: guides
title: "API: Actions"
description: Guides for the Actions API with java and javascript code samples
---
# Actions

To add custom behavior to your models you can use the Action API.

### Single Entity

Imagine you need to activate a given person. To do this you can create an Action class with
single entity action method:

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

To do the same thing in __Javascript__:

~~~ javascript
yawp('/people/123').put('active').done( function(status) {} );
~~~

### Over Collection

An action can also be over a collection of entities. To create an action over a collection,
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

### Request Json Payload

In actions, it is also possible to capture the json payload from the request.
This is simply done by adding a String or a Java POJO/Endpoint argument to the action's
method signature:

~~~ java
public class PersonAction extends Action<Person> {

    @POST
    public Person addAddress1(IdRef<Person> id, String json) {
        Address address = from(json, Address.class);
        person.setAddress(address);
        yawp.save(person);
    }

    // Or

    @POST
    public Person addAddress2(IdRef<Person> id, Address address) {
        person.setAddress(address);
        yawp.save(person);
    }

}
~~~

To invoke those actions from the javascript client:

~~~ javascript
yawp('/people/1').json({ city: 'Paris' }).post('add-address-1');

// Or

yawp('/people/1').json({ city: 'Paris' }).post('add-address-2');
~~~

### Request Parameters

If you want to access the request parameters inside your action just add
a __Map<String, String>__ in the method signature:

~~~ java
public class PersonAction extends Action<Person> {
    // single entity
    @GET
    public Person me(IdRef<Person> id, Map<String, String> params) {
        // ...
    }

    // over collection
    @GET
    public Person me(Map<String, String> params) {
        // ...
    }

    // over collection with parent IdRef
    @GET
    public Person first(IdRef<Company> companyId  Map<String, String> params) {
        // ...
    }
}
~~~

---
layout: guides
---
# Shields

With Shields it is possible to provide security to your endoint APIs. It works like a firewall 
white list where you can specify what is allowed. To create a simple Shield, just extend
the Shield class for your endpoint:

~~~ java
public class PersonShield extends Shield<Person> {

    (...)
~~~ 

Since this Shield works like a white list, by simply creating this class, all the endpoint exposed 
APIs get instantly blocked and they will return __404 Not Found__ in production.

### The Allow Method

Now, you can specify which routes you want to allow based on some business rules. You can do 
this by overriding the methods of the Shield base class and then calling the __allow()__ or 
__allow(boolean)__ method based on your security rules.

### Repository Actions

To allow only the show repository action of the person's model to be accessed by everyone, you can add this method to 
your Shield:

~~~ java
@Override
public void show(IdRef<Person> id) {
    allow();
}
~~~ 

Now, you may want to provide access to the destroy repository action only if the current logged user 
is the creator of a person's instance:

~~~ java
@Override
public void destroy(IdRef<Person> id) {
    Person person id.fetch();
    allow(person.getCreatorId(Session.getLoggedUserId());
}
~~~ 

The name of the method being the repository action you are overriding:

~~~ java
public void index(IdRef<?> parentId)

public void show(IdRef<T> id)

public void create(List<T> objects)

public void update(IdRef<T> id, T object)

public void destroy(IdRef<T> id)
~~~

### Custom Actions

_TODO_
 
### Special Rules

For convenience shields may override two special methods, they are:

~~~ java
public void always() {
   // for every route
}    

public void defaults() {
   // for route without a more specific shield rule.
} 
~~~

### Shield Where Clause

Shields can also filter the data a given user can access (read or write). For instance, if the 
current user can interact only with people he has created, the shield would be:

~~~ java
@Override
public void always() {
    allow().where("creatorId", "=", Session.getLoggedUserId());
}
~~~ 

### Shield Façades

Finally, Shields have a façade API. That means you can specify which attributes of your model a user can read or write. To do this, create a java interface that your model implements. Inside this interface specify what setters and getters will be allowed:

~~~ java
@Endpoint(path = "/people")
public class Person implements NameFacade {

    (...)

public interface NameFacade {

    public String getName();
    
    public void setName(String name);
    
    (...)
~~~ 

Now it is possible to wire up your façade:

~~~ java
@Override
public void always() {
    allow().where("creatorId", "=", Session.getLoggedUserId()).facade(NameFacade.class);
}
~~~ 

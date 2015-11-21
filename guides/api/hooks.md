---
layout: guides
---
# Hooks

Hooks intercept the request execution flow at some important stages and let you customize the default
behaviour of the __YAWP!__ APIs.

For instance, you can intercept entities right before they are saved and change some of its attributes. 
Another example is that you can intercept queries and force them to have a specific filter, order, 
limit, etc.

To create hooks, you need to extend the __Hook__ class and override its methods. If the generic 
type of you hook is __Object__, then this hook will intercept the flow of all endpoint models. 

This is a example of the __Hook__ feature for the __User__ endpoint model:

~~~ java
public class UserHook extends Hook<User> {

    @Override
    public void beforeQuery(DatastoreQuery<User> q) {
        q.where("company", "=", Session.getLoggedUser().getCompany());
    }

    @Override
    public void beforeSave(User user) {
        if (user.getAge() < 18) {
            throw new HttpException(422, "You must be 18 or more to sign up.");
        }
    }
}
~~~

The complete list of events that you can intercept is:

| Method            | Flow stage                            | May be used to...
| ----------------- |-------------------------------------- | --------------------- 
| __beforeShield__  | Before security is applied            | set entity information before the security shield is applied. For instance, it can be used to set the current logged user as the owner of the model.
| __beforeQuery__   | Before every query is executed        | add mandatory filter, order or limit to queries based on the current logge user.
| __beforeSave__    | Right before the entity is saved      | pre-calculate or cache some values in the entity, as well as make validations before saving.
| __afterSave__     | Right after the entity is saved       | trigger assynchronous actions or log events.
| __beforeDestroy__ | Right before the entity is destroyed  | do things same as beforeSave.
| __afterDestroy__  | Right after the entity is destroyed   | do things same as afterSave.

### Exceptions

As you could see in the example above, to interrupt the flow and create the request response 
with an error information, just throw a HttpException.

---
layout: guides
---
# Transformers

The Transformer API is used to create different views of the same domain object. If you wan't to add 
or hide information to be returned to the client, the way to go is to use a Transfomer. For instance:

~~~ java
public class BasicObjectTransformer extends Transformer<Person> {

    public Map<String, Object> upperCase(Person person) {
        Map<String, Object> map = asMap(person);
        map.put("name", person.getName().toUpperCase());
        return map;
    }
}
~~~

Now, to transform a given person, let's say with id 123, you can:

~~~ bash
curl -X GET http://localhost:8080/api<b>/people/123?t=upperCase</b>
~~~

The __Javascript__ equivalent would be:

~~~ javascript
yawp('/people/123').transform('upperCase').first( function(person) {} );
~~~

Note: All transformers can be applied for collections queries or fetching single objects.

Finally, you can also create more sofisticated transformers using the presenter pattern, like this:

~~~ java
public class UserTransformer extends Transformer<User> {

   public static class UserView {
        private String name;
        private String company;
        private int birthYear;

        public UserView(User user) {
            this.name = user.getName();
            this.company = user.getCompany();
            this.birthYear = Calendar.getInstance().get(Calendar.YEAR) - user.getAge();
        }
    }

    public UserView withYear(User user) {
        return new UserView(user);
    }
}
~~~

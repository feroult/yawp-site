---
layout: guides
---
# The Java Client

To access __YAWP!__ APIs from your server side endpoint features (shields, actions, transformers, hooks), 
you need  use its java client API. The method/attribute __yawp__ is available inside all of them.

### Contents

- [Repository Actions](#repository-actions)
- [Custom Actions](#custom-actions)
- [Query](#query)
- [Transformers](#transformers)

### Repository Actions
~~~ java
// create / update
yawp.save(person);

// destroy
yawp.destroy(id);

// fetch
yawp(Person.class).fetch(id);

// list
yawp(Person.class).list();
~~~

### Custom Actions

~~~ java
// @GET("me") over collection action 
feature(PersonMeAction.class).me();

// @PUT("reverse-name") single entity action
feature(PersonReverseNameAction.class).reverseName(id);
~~~

### Query 

~~~ java
// where + list
yawp(Person.class).where("name", "=", "janes").list();

// where + first
yawp(Person.class).where("name", "=", "janes").first();

// limit
yawp(Person.class).where("name", "=", "janes").limit(10).list();

// order
yawp(Person.class).where("name", "=", "janes").order("name", "asc").list();
~~~

### Transfomers

~~~ java
// transform + where + list
yawp(Person.class).transform("upperCase").where("name", "=", "janes").list();

// transform + first
yawp(Person.class).transform("upperCase").where("name", "=", "janes").first();
~~~

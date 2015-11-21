---
layout: guides
---
# The Java Client

To access __YAWP!__ APIs from your server side endpoint features (shields, actions, transformers, hooks), 
you need  use its java client API. The method/attribute __yawp__ is avaiable inside all of them.

### Contents

- [Repository Actions](#repository-actions)
- [Custom Actions](#custom-actions)
- [Query](#query)
- [Transformers](#transformers)

### Repository Actions
~~~ javascript
// create
yawp('/people').create({ name: 'janes' }).done(function (person) {
    console.log(person);
});

// update
yawp('/people/1').update({ name: 'janes' }).done(function (person) {
    console.log(person);
});

// patch
yawp('/people/1').patch({ name: 'janes' }).done(function (person) {
    console.log(person);
});

// destroy
yawp('/people/1').destroy().done(function (id) {
    console.log(id);
});

// fetch
yawp('/people/1').fetch(function (person) {
    console.log(person);
});

// list
yawp('/people').list(function (people) {
    console.log(people);
});
~~~

### Custom Actions

~~~ javascript
// @GET("me") over collection action 
yawp('/people').get('me').done(function (person) {
    console.log(person);
});

// @PUT("reverse-name") single entity action
yawp('/people/1').put('reverse-name').done(function (person) {
    console.log(person);
});
~~~

### Query 

~~~ javascript
// where + list
yawp('/people').where(['name', '=', 'janes']).list(function (people) {
    console.log(people);
});

// where + first
yawp('/people').where(['name', '=', 'janes']).first(function (person) {
    console.log(person);
});

// limit
yawp('/people').where(['name', '=', 'janes']).limit(10).list(function (people) {
    console.log(people);
});

// order
yawp('/people').where(['name', '=', 'janes']).order([{ p: 'name', d: 'asc'}])
               .list(function (people) {
    console.log(people);
});
~~~

### Transfomers

~~~ javascript
// transform + where + list
yawp('/people').transform('upperCase').where(['name', '=', 'janes']).list(function (people) {
    console.log(people);
});

// transform + first
yawp('/people').transform('upperCase').first(function (person) {
    console.log(person);
});
~~~


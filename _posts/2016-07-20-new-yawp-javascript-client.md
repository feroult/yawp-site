---
layout: blog
title: New Javascript Client
---

The new __YAWP! Javascript Client__ is ready to use! And it includes:

* Support for Node.js and React-Native platforms
* ES6 Promises refactory
* Endpoint extesion with ES6 class syntax or ES5 prototypes

For more details, see the [javascript client tutorial](/guides/tutorials/the-javascript-client) .

<!--more-->

# Node.js and React-Native

Now it is possible to write your API clients in Javascript and use them in different environments.

To use it in Web Apps, just add the regular script tag:

~~~ html
<script src="https://rawgit.com/feroult/yawp/yawp-1.6.5/yawp-client/lib/web/yawp.min.js"></script>
~~~

Now to use it in Node.js or React-Native:

~~~ bash
npm install yawp --save
~~~

# ES6 Promises

All YAWP! Javascript Client methods now return ES6 Promises, making it really easier to
work with asynchronous calls.

__Note__: Some existing client code may break, because we have renamed some callback methods.
It is really easy to fix doing the following changes:

* done callbacks changes to __then__.
* fail, exception and error callbacks change to __catch__.

# Endpoint Extensions

The most exciting feature of the new YAWP! Javascript Client is that all yawp client
methods can now be extended by subclassing the base __yawp function__ for a given endpoint.
And this can be done either with the ES6 class syntax or with ES5 prototypes.

For instance, to create a __Person__ endpoint extension that is linked to the __/people__ endpoint:

~~~ javascript
class Person extends yawp('/people') {
    static inactive() {
        return this.where('status', '=', 'INACTIVE');
    }

    activate() {
        return this.put('active');
    }
}
~~~

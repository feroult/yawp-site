---
layout: guides
---
# Scaffolding

Before you get used to the __YAWP!__ features API, the scaffold plugin can make your life a 
little bit easier =)

### Endpoint

~~~ bash
mvn yawp:endpoint -Dmodel=person
~~~

This will create the endpoint model __Person__. It also will create placeholders for its test suite and
the security Shield.

### Shield

~~~ bash
mvn yawp:shield -Dmodel=person
~~~

Create a __PersonShield_ if the endpoint model is not already shielded.

### Action

~~~ bash
mvn yawp:action -Dmodel=person -Dname=activate
~~~

Create a __PersonActivateAction__ custom action for the endpoint model.

### Transformer

~~~ bash
mvn yawp:transformer -Dmodel=person -Dname=upperCase
~~~

Create a __PersonUpperCaseTransformer__ transformer for the endpoint model.


#### Hook

~~~ bash
mvn yawp:hook -Dmodel=person -Dname=setUser
~~~

Create a __PersonSetUserHook__ hook for the endpoint model.



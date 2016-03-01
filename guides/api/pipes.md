---
layout: guides
title: "API: Pipes"
description: Guides for the Pipes API with java samples
---
# Pipes

With pipes it is possible to create aggregated views of your models information.
A pipe works asynchronously, which means they do not impact the write throughput
of your API and they have the same eventual consistency capabilities of your
models.

Finally, pipes can be connected to other pipes, so they can be used to construct
multiple levels of aggregation.

__The Pipe API is currently only implemented for the Appengine environment.__

### Pipe Flow

To create a Pipe, just extend the Pipe class for your endpoint model:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    (...)
}
~~~

Note that a Pipe feature takes an additional argument, which is called the __Sink__
of the pipe. The main idea is that the Pipe above connects two endpoint models,
the __Person__ (in this case, the source) and the __PersonCounter__ (the sink).

Again, the __PersonCounter__ class is a regular endpoint model, for instance it
could be:

~~~ java
@Endpoint(path = "/person_counters")
public class PersonCounter {

    @Id
    IdRef<PersonCounter> id;

    Integer count = 0;

}
~~~

Now we need to describe how the sources is linked to sinks. To do this,
we need to override the __configureSinks(source)__:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void configureSinks(Person person) {
        addSinkId(id(PersonCounter.class, 1l));
    }   
}
~~~

_Note:_ In this case, we are linking all persons to a single counter (with id=1).

Finally, we need to describe the aggregation that we are performing. To do this,
we need to override two methods: __flux(source, sink)__ and __reflux(source, sink)__:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void configureSinks(Person person) {
        addSinkId(id(PersonCounter.class, 1l));
    }   

    @Override
    public void flux(Person person, PersonCounter counter) {
        counter.count++;
    }

    @Override
    public void reflux(Person person, PersonCounter counter) {
        counter.count--;
    }    

}
~~~

Those methods are self explanatory. They are invoked when a given person is connected
to a counter (flux) and when a person is destroyed or changed in a way that
configureSinks does not connect it to a previous connected sink anymore (reflux).

### Pipe Reflow

Sometimes it may be necessary to reflow all sources associated to a sink again due
to some change in the sink itself. For instance, imagine an aggregator that sums the
total sales for a given time period. Your sink may have the attributes that define its period,
if them you'll want to reflow this again to make the aggregation consistent.

For instance, the sales aggregator could be:

~~~ java
@Endpoint(path = "/sales_by_period")
public class SalesByPeriod {

    @Id
    IdRef<SalesByPeriod> id;

    Date start;

    Date end;

    Double total = 0.0;

}
~~~

Now, the Pipe to compute this aggregation could be:

~~~ java
public class SalesByPeriodPipe extends Pipe<Sale, SalesByPeriod> {

    @Override
    public void configureSinks(Sale Sale) {
        addSinkId(id(PersonCounter.class, 1l));
    }   

    @Override
    public void flux(Person person, PersonCounter counter) {
        counter.count++;
    }

    @Override
    public void reflux(Person person, PersonCounter counter) {
        counter.count--;
    }    

}
~~~

### Consistency Warning

### Pipe Reload Tool

If you have just created the Pipe presented in this guide and you already have
persons in your datastore, or you've deleted your counter model by mistake,
it is possible to fully reload a Pipe to make it consistent with the current
situation of your data (i.e count all persons again).

To to this, you need to override the __drain__ method of your Pipe, this needed to describe
how a sink is drained before it is reloaded:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void drain(PersonCounter counter) {
        counter.count = 0;
    }
}
~~~

Now, point your browser to the following url, to invoke the pipe reload tool:

```bash
http://localhost:8080/_ah/yawp/pipes/reload?pipe=yourpackage.PersonCounterPipe
```

_You may change the address to your app real host._

The servlet above is mapped in your web.xml when you create the project from
the yawp's maven archetype.

__Note__: This tool is meant to be used in maintenance mode, so you need
to make sure that there's no concurrent writes to the Person API
while you are reloading the Pipe, otherwise your counter may become corrupted.

To verify the status of a pipe reload job, just point your browser to the following
address:

```bash
http://localhost:8080/_ah/pipeline/list
```

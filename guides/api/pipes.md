---
layout: guides
title: "API: Pipes"
description: Guides for the Pipes API with java samples
---
# Pipes

With pipes it is possible to create aggregated views (joins) of your models information.
A pipe works asynchronously, which means they do not impact the write throughput
of your API and they also have the same eventual consistency capabilities of your
models.

Finally, pipes can be connected to other pipes, so they can be used to construct
multiple levels of aggregations:

<img src="/assets/img/pipes/aggregation.jpg" />

__Note__: The Pipe API is currently only implemented for the Appengine environment.

### Consistency Warning

All pipes are designed to have the same eventual consistency capabilities of the
Appengine datastore, that guarantees that in a near future all nodes will have the the
same information and they will be consistent with the data they are aggregating.

To achieve this result it is important to make sure that two special methods of the
Pipe only uses ancestor queries or key fetches to retrieve the relations between
sources and sinks. Those methods are indicated in the comments of the following
examples.

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

The __PersonCounter__ class is a regular endpoint model, for instance it
could be:

~~~ java
@Endpoint(path = "/person_counters")
public class PersonCounter {

    @Id
    IdRef<PersonCounter> id;

    Integer count = 0;

}
~~~

Now we need to describe how the sources are linked to sinks. To do this,
we need to override the __configureSinks(source)__:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void configureSinks(Person person) {
        // sinks need to be retrieved with strong consistent query/fetch
        addSinkId(id(PersonCounter.class, 1l));
    }   
}
~~~

__Note:__ In this case, we are linking all persons to a single counter (with id=1).

Finally, we need to describe the aggregation we wish to perform. To do this,
we need to override two methods: __flux(source, sink)__ and __reflux(source, sink)__:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void configureSinks(Person person) {
        // sinks need to be retrieved with strong consistent query/fetch
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

These methods are self-explanatory. They are invoked when a given person is connected
to a counter (flux) and when a person is destroyed or changed in a way that
configureSinks does not connect it to the sink anymore (reflux).

### Pipe Reflow

Sometimes it may be necessary to reflow all sources already associated to a sink due
to a change in the sink itself. For instance, imagine an aggregator that sums the
total sales for a given time period. Your sink may have the attributes that define its period,
if they change you'll want to reflow the sources again to make the aggregation consistent.

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

To be reflowed, a Pipe also needs to define how to retrieve sources based on a
given __sink__, to do this, we need to override the __configureSources(sink)__
method:

~~~ java
public class SalesByPeriodPipe extends Pipe<Sale, SalesByPeriod> {

    @Override
    public void configureSources(SalesByPeriod period) {
        // sources need to be retrieved with strong consistent query/fetch
        addSourcesQuery(yawp(Sale.class).from(getCompanyId())
                                        .where("date", ">=", period.start)
                                        .and("date", "<", period.end));
    }

}
~~~

__Note:__ Sometimes it may be necessary to create intermediate aggregations to unchangeable sinks
to provide a way to have an ancestor query for sources (to guarantee consistency).
For instance, it would be possible to compute the total sales for each day in the month
(days in month don't change, right) and then re-pipe this to the SalesByPeriod aggregation.
And then, to reflow this pipe, compute the ids from the days it includes.

Finally, to indicate in which conditions the sink needs to be reflowed, you have to
override the __reflowCondition(newSink, oldSink)__ method, like this:

~~~ java
public class SalesByPeriodPipe extends Pipe<Sale, SalesByPeriod> {

    (...)

    @Override
    public boolean reflowCondition(SalesByPeriod newPeriod, SalesByPeriod oldPeriod) {
        if(oldPeriod == null) {
            return true;
        }
        return !newPeriod.start.equals(oldPeriod.start) || !newPeriod.end.equals(oldPeriod.end);
    }

    (...)
}
~~~

### Pipe Reload Tool

If you have just created the Pipe presented in this guide and you already have
persons in your datastore, or you've deleted your counter model by mistake,
it is possible to fully reload a Pipe to make it consistent with the current
situation of your data (i.e count all persons again).

To to this, you need to override the __drain__ method of your Pipe, this is needed
to describe how a sink is drained before it is reloaded:

~~~ java
public class PersonCounterPipe extends Pipe<Person, PersonCounter> {

    @Override
    public void drain(PersonCounter counter) {
        counter.count = 0;
    }
}
~~~

Now, point your browser to the following url, to invoke the pipe reload tool:

~~~
http://localhost:8080/_ah/yawp/pipes/reload?pipe=yourpackage.PersonCounterPipe
~~~

You may change the address to your app real host.

The servlet above is mapped in your web.xml when you create the project from
the YAWP!'s maven archetype.

__Note__: This tool is meant to be used in maintenance mode, so you need
to make sure that there's no concurrent writes to the Person API
while you are reloading the Pipe, otherwise your counter may become corrupted.

To verify the status of a pipe reload job, just point your browser to the following
address:

~~~
http://localhost:8080/_ah/pipeline/list
~~~

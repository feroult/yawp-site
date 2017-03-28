---
layout: blog
title: Cloud SQL Synchronization
---

Sometimes we want to export information from our datastore models to different
storage technologies, with different capabilities. 

A relational database is a good option if we need to create aggregation reports from our data, 
which in turn is really difficult to do directly from datastore, since it doesn't support
joins.

This guide shows how to keep datastore/yawp models in sync with Google Cloud SQL.

<!--more-->

### Introduction

It is important to note that the Cloud SQL and the datastore have different
scalability models. Cloud SQL has a single node architecture, so it scales vertically, 
while datastore has a distributed model and it scales horizontally.

What it means is that, depending on the volume of information you have in datastore, this
synchronization idea won't work well. In that case, you may consider using a "Big Query like" 
technology, with a few tweaks to this guide.

The idea is to use datastore as our primary storage technology and then asynchronously 
update a corresponding Cloud SQL table/row every time an entity is created or updated.

The full source code for this guide can be found [here](https://github.com/feroult/yawp-tutorials/tree/master/cloudsqlsync)

### Overview

The process detailed in this post consists in the following steps:

1. [Project bootstrap](#project-bootstrap)
2. [Creating the entity model](#creating-the-entity-model)
3. [Cloud SQL Setup](#cloud-sql-setup)
4. [Application Setup](#application-setup)
5. [Creating the synchronization Hook](#creating-the-synchronization-hook)
6. [Saving entities to Cloud SQL](#saving-entities-to-Cloud SQL)
7. [Testing the synchronization](#testing-the-synchronization)
8. [Flushing existing entities](#flushing-existing-entities)

### Project bootstrap

~~~ bash
mvn archetype:generate     
       -DarchetypeGroupId=io.yawp
       -DarchetypeArtifactId=yawp
       -DarchetypeVersion=LATEST
       -DgroupId=Cloud SQLsync
       -DartifactId=cloudqlsync
~~~

### Creating the entity model

We'll use a simple __Order__ model to store orders for products 
with quantity and timestamp fields. Inside the project folder:

~~~ bash
cd cloudqlsync
mvn yawp:endpoint -Dmodel=order
~~~

Add the fields to the Order class:

~~~ java
@Endpoint(path = "/orders")
public class Order {

    @Id
    IdRef<Order> id;

    String product;

    Long quantity;

    Date createdAt;

}
~~~

With this endpoint, we should be able to create orders. To try it we need to start the devserver
and then use the __yawp-cli__ tool to test the api.

~~~ bash
mvn yawp:devserver
~~~

~~~ bash
npm install -g yawp-cli
~~~ 

Now run:

~~~ bash
yawp console
~~~

And, inside the console:

~~~ javascript
yawp('/orders').create({product: 'test', quantity: 10});
~~~

### Cloud SQL Setup

Now we can configure our the Cloud SQL MySQL database. 

Open the [Google Cloud console](http://console.cloud.google.com/) and create a new Cloud SQL instance.
It is fine to use all the defaults.

After the instance is created, take note of the __Instance connection name__ and __IP Address__
of your instance. They can be found in the property group in the __Instance Details__ panel.

For the next steps, we'll need the __mysql__ command line client. You should install 
it for your specific operating system. 

Connect to the instance:

~~~ bash
mysql -h <Cloud SQL IP> -u root -p
~~~

Create the app user and database:

~~~ bash
mysql> create database yawp;
Query OK, 1 row affected (0.00 sec)

mysql> create user yawp;
Query OK, 0 rows affected (0.01 sec)

mysql> grant all on yawp.* to 'yawp'@'localhost' identified by 'yawp';
Query OK, 0 rows affected, 1 warning (0.00 sec)
~~~

### Application Setup

Open the __pom.xml__ file and add the following dependency:

~~~ xml
<dependency>
    <groupId>com.google.cloud.sql</groupId>
    <artifactId>mysql-socket-factory</artifactId>
    <version>1.0.2</version>
</dependency>
~~~

Finally, open the __appengine-web.xml__ file and add the following properties:

~~~ xml
<property name="Cloud SQL.url"
          value="jdbc:google:mysql://${INSTANCE_CONNECTION_NAME}/${database}?user=${user}&amp;password=${password}"/>
<property name="Cloud SQL.url.local"
          value="jdbc:mysql://google/${database}?Cloud SQLInstance=${INSTANCE_CONNECTION_NAME}&amp;socketFactory=com.google.cloud.sql.mysql.SocketFactory&amp;user=${user}&amp;password=${password}&amp;useSSL=false"/>
~~~

### Creating the synchronization Hook

Now that we have all set up, we can create our synchronization hook. For that, we will 
use the yawp’s hierarchy model and create an abstraction to make it 
possible to easily synchronize any model by just marking it with a regular java interface.

Inside the __models.syncable__ package, create the following interface:

~~~ java
public interface Syncable {
}
~~~

Now we create the Hook that will be triggered for of any model that implements this interface.
Let's use the scaffolder to do this:

~~~ bash
mvn yawp:hook -Dmodel=Syncable -Dname=CloudSQL
~~~

Change the code to be:

~~~ java
public class SyncableCloudSQLHook extends Hook<Syncable> {

    @Override
    public void beforeSave(Syncable entity) {
        if (!yawp.isTransationInProgress()) {
            yawp.begin();
        }
    }

    @Override
    public void afterSave(Syncable entity) {
        feature(SynchronizationHelper.class).enqueueTaskFor(entity);
        yawp.commit();
    }

}
~~~

Note that we are creating a deferred task that will handle the Cloud SQL update asynchronously and
it is important that this task is added to the queue within the same datastore transaction that
saves the entity to the datastore.

__Versions__

If we take a look inside the __enqueueTaskFor__ method, one important thing to note is that
we are saving [__Version__](https://github.com/feroult/yawp-tutorials/blob/master/cloudsqlsync/src/main/java/cloudsqlsync/models/syncable/Version.java) markers for each model before we actually enqueue the tasks.

~~~ java
public void enqueueTaskFor(Object entity) {
    Queue queue = QueueHelper.getDefaultQueue();
    Version taskVersion = saveVersionMarker(entity);
    queue.add(TaskOptions.Builder.withPayload(new SynchronizationDeferredTask(entity, taskVersion)));
}
~~~

As we will see in the next session, this is done to avoid possible problems caused by parallel updates
to the same entity.

### Saving entities to Cloud SQL

The code responsible for updating the Cloud SQL is in the deferred task [__SynchronizationDeferredTask__](https://github.com/feroult/yawp-tutorials/blob/master/cloudsqlsync/src/main/java/cloudsqlsync/models/syncable/SynchronizationDeferredTask.java).

The most important part of this class is:

~~~ java
public void run() {
    if (!isRightVersion()) {
        return;
    }

    SynchronizationHelper helper = feature(SynchronizationHelper.class);

    SqlConnection conn = SqlConnection.newInstance();
    try {

        helper.createTableIfNotExists(conn, entityKind);
        helper.updateEntity(conn, entityKind, entityUri, entityJson, taskVersion);
        conn.commit();

    } finally {
        conn.close();
    }

}
~~~

This method will run asynchronously by means of the appengine task queue. Note that we first check
if the task is running for the right version marker (saved before the tasks was created,
within the datastore transaction).

If the version is right, the next part is pretty straight forward. We connect to the database, create
the table if it doesn't exist and then update the entity.

The code for handling the database/sql interaction can be found in the [helper class](https://github.com/feroult/yawp-tutorials/blob/master/cloudsqlsync/src/main/java/cloudsqlsync/models/syncable/SynchronizationHelper.java).

### Testing the synchronization

Now it is time to test if everything is working.

We go to our project folder and start the development server:

~~~ bash
mvn yawp:devserver -DINSTANCE_CONNECTION_NAME=<Instance connection name> -Duser=root -Dpassword=<password> -Ddatabase=yawp
~~~

In other shell launch the __yawp console__:

~~~ bash
yawp console
~~~

And, inside the console:

~~~ javascript
yawp('/orders').create({product: 'now it works', quantity: 100});
~~~

Wait a little bit, open the mysql:

~~~ bash
mysql -h <Cloud SQL IP> -u root -p
~~~

Then execute the following query:

~~~ sql
mysql> use yawp;
mysql> select * from orders;
~~~

And the result should be:

~~~
+--------------------------+-------------------------------------------------------------
| id                       | entity                                                          
+--------------------------+-------------------------------------------------------------
| /orders/5629499534213120 | {"id": "/orders/5629499534213120", "product": "now it works"
+--------------------------+-------------------------------------------------------------
1 row in set (0.25 sec)
~~~

### Flushing existing entities

There are many ways to flush previous existing entities to the Cloud SQL. One could use the
[dsopz](https://github.com/murer/dsopz) tool to export all entities, convert the file to CSV or SQL syntax and then
import it to Cloud SQL.

Within the demo repository we provide an option that uses the task queue to do the complete job of 
flushing the existing entities.
You can check the code in this [package](https://github.com/feroult/yawp-tutorials/tree/master/cloudsqlsync/src/main/java/cloudsqlsync/models/syncable/init).






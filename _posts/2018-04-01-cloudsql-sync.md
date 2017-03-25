---
layout: blog
title: Cloud SQL Datastore Sync
---

Sometimes we want to export information from our datastore models to different
storage technologies, with different capabilities. 

A relational database is a good option if we need to create aggregation reports from our data, 
wich in turn is really difficult to do directly from datastore, since it doen't support
joins nativelly.

This guide shows how to keep datastore/yawp models in sync with Google Cloud SQL.

<!--more-->

### Introduction

It is important to note that the Cloud SQL and the datastore have different
scalability models. Cloud SQL has a single node architecture, so it scales vertically, 
while datastore has a distributed model and it scales horizontally.

What it means is that, depending on the volume of information you have in datastore, this
synchornization idea won't work well. In that case, you may consider using a "Big Query like" 
technology, with a few tweeks to this guide.

The idea is to use datastore as our primary storage technology and then assynchronouly 
update a corresponding Cloud SQL table/row every time an entity is created or updated.

The full source code for this guide can be found [here](xxx)

### Bootstrap your YAWP! project

~~~ bash
mvn archetype:generate     
       -DarchetypeGroupId=io.yawp
       -DarchetypeArtifactId=yawp
       -DarchetypeVersion=LATEST
       -DgroupId=cloudsqlsync
       -DartifactId=cloudqlsync
~~~

### Create a simple model

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
and then we can use the [yawp-cli](xxx) tool to test the api.

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

### Configuring Cloud SQL

Now we can configure our the Cloud SQL MySQL database. 

Open the [Google Cloud console](xxx) and create a new Cloud SQL instace. It is fine to use all
the defaults.

After the instance is created, take note of the __Instance connection name__ and __IP Address__
of your instance. They can be found inside the properties group in the __Instance Details__ panel.

For the next steps, we'll need the __mysql__ command line client. You should install 
it for your specific operating system. 

Connect to the instance:

~~~ bash
mysql -h <CloudSQL IP> -u root -p
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

### Configuring the Application

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
<property name="cloudsql.url"
          value="jdbc:google:mysql://${INSTANCE_CONNECTION_NAME}/${database}?user=${user}&amp;password=${password}"/>
<property name="cloudsql.url.local"
          value="jdbc:mysql://google/${database}?cloudSqlInstance=${INSTANCE_CONNECTION_NAME}&amp;socketFactory=com.google.cloud.sql.mysql.SocketFactory&amp;user=${user}&amp;password=${password}&amp;useSSL=false"/>
~~~

### Creating the synchronization Hook







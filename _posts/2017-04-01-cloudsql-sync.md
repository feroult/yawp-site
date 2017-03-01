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

### Create a simple endpoint model

For this example, we will have a simple __Order__ model, to store orders for products 
with quantity and timestamp fields.

~~~
~~~


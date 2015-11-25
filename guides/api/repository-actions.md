---
layout: guides
title: "API: Repository Actions"
description: Guides for the Repository Actions API
---
# Repository Actions

All endpoint models have default repository actions. That means that you can create, fetch, update/patch, 
destroy and query them.

You can access the repository APIs in three ways: 

* The [java client](/guides/tutorials/the-java-client);
* The [javascript client](/guides/tutorials/the-javascript-client);
* Or the raw http/json API.

The following table summarizes the available repository actions:

| Verb        | Path                    | Action           
| ----------- |------------------------ | -------------------
| GET         | /{endpoint_path}        | List entities   
| POST        | /{endpoint_path}        | Create a entity 
| GET         | /{endpoint_path}/{id}   | Show a entity   
| PUT/PATCH   | /{endpoint_path}/{id}   | Update a entity 
| DELETE      | /{endpoint_path}/{id}   | Destroy a entity 


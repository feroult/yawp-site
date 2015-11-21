---
layout: guides
---
# Repository Actions

All endpoint models have default repository actions. That means that you can create, fetch, update/pache, 
destroy and query.

You can use them in three ways: From the [java client](/guides/tutorials/the-java-client), the [javascript client](/guides/tutorials/the-javascript-client) or the raw http/json 
API.

The following table sumarizes the avaible repository actions:

| Verb        | Path                    | Action           
| ----------- |------------------------ | -------------------
| GET         | /{endpoint_path}        | List entities   
| POST        | /{endpoint_path}        | Create a entity 
| GET         | /{endpoint_path}/{id}   | Show a entity   
| PUT/PATCH   | /{endpoint_path}/{id}   | Update a entity 
| DELETE      | /{endpoint_path}/{id}   | Destroy a entity 


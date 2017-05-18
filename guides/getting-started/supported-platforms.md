---
layout: guides
title: "Getting Started: Supported platforms"
description: Information about YAWP!'s supported platforms
---
# Supported platforms

__YAWP!__ supports two platforms as persistence layers: [Google App Engine Datastore](https://cloud.google.com) and [PostgreSQL](http://www.postgresql.org).


<div class="platforms">
    <img src="/assets/img/platforms/appengine.png" />
    <img src="/assets/img/platforms/postgres.png" />
</div>

The main idea is that you can bootstrap your application really fast using
App Engine's auto-scaling PaaS (free to start). But if scalability is not an issue
or if you'd rather handle it by yourself, with the aid of YAWP!'s PostgreSQL persistence
driver you can also deploy your API to an IaaS (e.g., Amazon AWS) in which you can
have more control of the environment.

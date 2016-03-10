---
layout: guides
title: "Getting Started: Supported platforms"
description: Information about the YAWP!'s supported platforms
---
# Supported platforms

__YAWP!__ supports two platforms as persistence layers: [Google Appengine Datatore](https://cloud.google.com) and [PostgreSQL](http://www.postgresql.org).


<div class="platforms">
    <img src="/assets/img/platforms/appengine.png" />
    <img src="/assets/img/platforms/postgres.png" />
</div>

The main idea is that you can bootstrap your application really fast using the
Appengine auto-scaling PaaS (free to start). But if scalability is not an issue
or you'd rather do-it-yourself, with the ad of the YAWP!'s PostgreSQL persistence
driver, you can also deploy your API to a IaaS (i.e Amazon AWS) where you can
have where you can have more control of the environment.

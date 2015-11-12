---
layout: guides
---
# To-Do List App

This is a simple yet comprehensive tutorial that shows how to use the most of the important features
of the __YAWP!__ framework in practice.

### App Backlog

Before we start to code our to-do list api, lets take a look at the wishes of our user:

| # | Story         | As a user I want...    
| - |-------------- |----------------------------
| 1 | Create Tasks  | To create tasks so I can remember to do things
| 2 | Add Notes     | To add notes to a task before it is complete
| 3 | Mark as Done  | To mark my tasks as done so I can see only unfinished tasks
| 4 | Privacy       | That my tasks are only visible to me
| 5 | Notification  | To be notified before the deadline of my tasks

### 1 - Create Project

To bootstrap our api, lets use the __YAWP!__ maven archetype:

~~~ bash
mvn archetype:generate \
   -DarchetypeGroupId=io.yawp -DarchetypeArtifactId=yawp -DarchetypeVersion=LATEST \
   -DgroupId=todoapp -DartifactId=todoapp -Dversion=1.0-SNAPSHOT
~~~


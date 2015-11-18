---
layout: guides
---
# To-Do List App

This is a simple yet comprehensive tutorial that shows how to use the fundamental features
of the __YAWP!__ framework in practice.

### Contents

- [The App Backlog](#the-app-backlog)
- [Create the App Project](#create-the-app-project)
- [#1 User Story: Create Tasks](#user-story-create-tasks)
- [#2 User Story: Add Notes](#user-story-add-notes)

### The App Backlog

Before we start to code our to-do list api, lets take a look at the wishes of our user:

| # | Story         | As a user I want...    
| - |-------------- |----------------------------
| 1 | Create Tasks  | To create tasks so I can remember to do things
| 2 | Add Notes     | To add notes to a task before it is complete
| 3 | Mark as Done  | To mark my tasks as done so I can see only unfinished tasks
| 4 | Privacy       | That my tasks are only visible to me
| 5 | Notification  | To be notified before the deadline of my tasks

### Create the App Project

To bootstrap our api, lets use the __YAWP!__ maven archetype:

~~~ bash
mvn archetype:generate \
   -DarchetypeGroupId=io.yawp -DarchetypeArtifactId=yawp -DarchetypeVersion=LATEST \
   -DgroupId=todoapp -DartifactId=todoapp -Dversion=1.0-SNAPSHOT
~~~

Inside the app folder, compile the project to verify the installation:

~~~ bash
cd todoapp
mvn clean install
~~~

Start the development server:

~~~ bash
mvn yawp:devserver
~~~

__Note:__ If you are using an IDE that automatically compiles to the project's
target folder, you won't need to restart the development server again, your changes will get
__hot deployed__ by the yawp's maven plugin.


### #1 User Story: Create Tasks

To get the first user story done we're going to need a place to store our tasks information. 
To do this, we will create a __Task__ endpoint running the yawp scaffolding plugin. 

Open another shell window/tab and run the following command, inside the app root folder:

~~~ bash
mvn yawp:endpoint -Dmodel=task
~~~

The scaffold will create three files:

~~~ java
[INFO] Scaffold src/main/java/todoapp/models/task/Task.java created.
[INFO] Scaffold src/test/java/todoapp/models/task/TaskTest.java created.
[INFO] Scaffold src/main/java/todoapp/models/task/TaskShield.java created.
~~~

Lets take a look at the __TaskTesk__ class:

~~~ java
public class TaskTest extends EndpointTestCase {

    @Test
    public void testCreate() {
        // TODO Auto-generated method stub
        String json = post("/tasks", "{}");
        Task task = from(json, Task.class);

        assertNotNull(task);
    }
}
~~~

Now, lets make the test more realistic by adding some information to the task model:

~~~ java
public class TaskTest extends EndpointTestCase {

    @Test
    public void testCreate() {
        String json = post("/tasks", "{ 'title': 'wash dishes' }");
        Task task = from(json, Task.class);
		
        assertEquals("wash dishes", task.getTitle());
    }
}
~~~

Just remember to import static __assertEquals__.

Now, our test class is not compiling because the title field does not exist in the __Task__ endpoint model.
Lets add it. Open the __Task__ endpoint class to add the title attribute:

~~~ java
@Endpoint(path = "/tasks")
public class Task {

    @Id
    private IdRef<Task> id;

    private String title;

    public IdRef<Task> getId() {
        return id;
    }

    public void setId(IdRef<Task> id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
~~~

If we run the unit test again, everything should be ok. With this, we already have an API to create
tasks. We can verify it with cURL:

~~~ bash
curl -H "Content-type: application/json" -X POST \
     -d "{'title': 'test task'}" http://localhost:8080/api/tasks
~~~

You also should try the javascript client. Open the javascript console of your browser and type:
 
~~~ javascript
// create a task
yawp('/tasks').create({ title: 'js task' });

// list the tasks
yawp('/tasks').list(function(tasks) { console.log(tasks); });
~~~

### #2 User Story: Add Notes




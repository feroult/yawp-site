---
layout: guides
title: "Tutorials: To-do list app"
description: A simple yet comprehensive tutorial that shows how to use the fundamental features of the YAWP! framework in practice.
---
# To-do list app

This is a simple yet comprehensive tutorial that shows how to use the fundamental features
of the __YAWP!__ framework in practice.

### Contents

- [The App Backlog](#the-app-backlog)
- [Source Code](#source-code)
- [Create the App Project](#create-the-app-project)
- [#1 User Story: Create Tasks](#user-story-create-tasks)
- [#2 User Story: Add Notes](#user-story-add-notes)
- [#3 User Story: Mark as Done](#user-story-mark-as-done)
- [#4 User Story: Privacy](#user-story-privacy)

### The App Backlog

Before we start to code our to-do list API, let's take a look at the wish list of our "customer":

| # | Story         | As a user I want...    
| - |-------------- |----------------------------
| 1 | Create Tasks  | To create tasks so I can remember to do things
| 2 | Add Notes     | To add notes to a task before it is complete
| 3 | Mark as Done  | To mark my tasks as done so I can see only unfinished tasks
| 4 | Privacy       | That my tasks are only visible to me

### Source Code

For reference, the complete source code of this tutorial can be found [here](http://github.com/feroult/yawp-todoapp).

### Create the App Project

To bootstrap our API, let's use the __YAWP!__ maven archetype:

~~~ bash
mvn archetype:generate \
   -DarchetypeGroupId=io.yawp -DarchetypeArtifactId=yawp -DarchetypeVersion=LATEST \
   -DgroupId=todoapp -DartifactId=todoapp -Dversion=1.0-SNAPSHOT
~~~

Inside the app folder, start the development server:

~~~ bash
cd todoapp
mvn yawp:devserver
~~~

__Note:__ If you are using an IDE that automatically compiles to the project's
target folder, you won't need to restart the development server again, your changes will get
__hot deployed__ by the yawp's maven plugin.


### #1 User Story: Create Tasks

To get the first user story done we're going to need a place to store our tasks information. 
To do this, we will create a __Task__ endpoint running the yawp's scaffolding plugin. 

Open another shell window/tab and run the following command:

~~~ bash
mvn yawp:endpoint -Dmodel=task
~~~

The scaffold will create three files:

~~~ java
[INFO] Scaffold src/main/java/todoapp/models/task/Task.java created.
[INFO] Scaffold src/test/java/todoapp/models/task/TaskTest.java created.
[INFO] Scaffold src/main/java/todoapp/models/task/TaskShield.java created.
~~~

Let's take a look at the __TaskTesk__ class:

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

Now, let's make the test more realistic by adding some information to the task model:

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

Just remember to import as static the __assertEquals__ method.

Now, our test class is not compiling because the title field does not exist in the __Task__ endpoint class. 
Open it to add the title attribute:

~~~ java
@Endpoint(path = "/tasks")
public class Task {

    @Id
    private IdRef<Task> id;

    private String title;
    
    public String getTitle() {
        return title;
    }
}
~~~

All endpoints must have one and only one __@Id__ attribute. It also has to be of type __IdRef&lt;T&gt;__, 
where T is the endpoint POJO class.

If we run the unit test again, everything should be ok. With this, we already have an API to create
tasks. We can verify it with cURL:

~~~ bash
curl -H "Content-type: application/json" -X POST \
     -d "{'title': 'test task'}" http://localhost:8080/api/tasks
~~~

You should also try the yawp's [javascript client](/guides/tutorials/the-javascript-client). Since the library
is already loaded in this tutorial page, you can open the javascript console of your browser and type:
 
~~~ javascript
// create a task
yawp('/tasks').create({ title: 'js task' });

// list the tasks
yawp('/tasks').list(function(tasks) { console.log(tasks); });
~~~

### #2 User Story: Add Notes

Picking the next item in our backlog, we are going to make it possible to add text notes to each task.

Lets increment our unit test to deal with this new requirement:

~~~ java
@Test
public void testCreateWithNotes() {
    String json = post("/tasks", "{ notes: ['note 1', 'note 2'] }");
    Task task = from(json, Task.class);

    assertEquals(2, task.getNotes().size());
    assertEquals("note 1", task.getNotes().get(0));
    assertEquals("note 2", task.getNotes().get(1));
}
~~~

Open the __Task__ class and add the following attribute:

~~~ java
@Json
private List<String> notes;

public List<String> getNotes() {
    return notes;
}
~~~

If we run our tests, they should pass.

You may have noticed that you'll only need to add getters and setters to the endpoint attributes 
if you're going to access them from your server side (java) code. Also, notice that the __@Json__ 
annotation is used to tell the framework that the attribute will be serialized as a json object when 
the model is read from or written to the persistence layer. 

We can test our new API with javascript:

~~~ javascript
// to create a task with notes
yawp('/tasks').create({ title: 'task1', 
                        notes: ['note 1', 'note 2'] }).done(function (task)) {
                        
    // to change the notes of an already created task 
    yawp(task).patch({ notes: ['note 3'] });
    
});
~~~

### #3 User Story: Mark as Done

To mark a task as done, we're going to create a custom action. Let's first add a test:

~~~ java
@Test
public void testMarkAsDone() {
    post("/tasks/1", "{}");
    assertFalse(yawp(Task.class).fetch(1l).isDone());

    put("/tasks/1/done");
    assertTrue(yawp(Task.class).fetch(1l).isDone());
}
~~~

Create the missing task method and then run the test above. As you can see, we get an error 
saying that there is no endpoint called done. This is because __YAWP!__ cannot find a route 
for that uri. 

Let's create an action for the given route using a scaffold:

~~~ bash
mvn yawp:action -Dmodel=task -Dname=MarkAsDone
~~~

Open the created class __TaskMarkAsDoneAction__ and make the following changes:

~~~ java
public class TaskMarkAsDoneAction extends Action<Task> {

    @PUT("done")
    public void done(IdRef<Task> id) {
        Task task = id.fetch();
        task.markAsDone();
        yawp.save(task);
    }
    
}
~~~

Finally, change the __Task__ endpoint to add the done flag:

~~~ java
private boolean done;

public void markAsDone() {
    this.done = true;
}

public boolean isDone() {
    return done;
}
~~~

Run the tests again, they should pass. Again, to access the API with javascript:

~~~ javascript
yawp('/tasks').create({}).done(function (task) {
    yawp(task).put('done');
});
~~~

### #4 User Story: Privacy

The last item in our MVP backlog tells that the user doesn't want that other users have access to its
tasks information. First let's add a test for that:

~~~ java
@Test
public void testPrivacy() {
    helper().login("janes", "rock.com");
    post("/tasks", "{ title: 'janes task' }");

    List<Task> tasks1 = fromList(get("/tasks"), Task.class);
    assertEquals(1, tasks1.size());
    assertEquals("janes task", tasks1.get(0).getTitle());

    helper().login("jim", "rock.com");
    List<Task> tasks2 = fromList(get("/tasks"), Task.class);
    assertEquals(0, tasks2.size());
}

private AppengineTestHelper helper() {
    return (AppengineTestHelper) helper;
}
~~~

Note that we are using the specific __AppengineTestHelper__ because this environment already has a default
support for users authentication. If we run it, the test should fail because the user Jim has access
to the Janes' task.

Now, to fulfil this requirement we need to assign tasks to users. Let's change our __Task__ class to add
this association:

~~~ java
@Index
private String user;
~~~

Plus, to assign tasks to users we also need to add an endpoint Hook that sets the user attribute before the 
security shield kicks in. Again, using a scaffold:

~~~ bash
mvn yawp:hook -Dmodel=task -Dname=SetUser
~~~

Change the generated scaffold file to look like the following snippet:

~~~ java 
public class TaskSetUserHook extends Hook<Task> {

    @Override
    public void beforeShield(Task task) {
        if(!userService().isUserLoggedIn()) {
            return;
        }
        task.setUser(userService().getCurrentUser().getEmail());
    }

    private UserService userService() {
        return UserServiceFactory.getUserService();
    }

}
~~~

The privacy test should still be failing. Now it is time to add logic to our security shield that
will handle the privacy requirement. Open the class __TaskShield__ and change its contents to the
following:

~~~ java
public class TaskShield extends Shield<Task> {

    @Override
    public void defaults() {
        allow().where("user", "=", currentUserEmail());
    }

    private String currentUserEmail() {
        return UserServiceFactory.getUserService().getCurrentUser().getEmail();
    }
}
~~~

Run the __TaskTest__ suite again. Oooops, now only the __testPrivacy__ method is passing. This is
because the other tests do not login the user before they create tasks. Lets fix this by adding a 
default user to all tests. Just add the following snippet before section to the __TaskTest_ class:

~~~ java
@Before
public void defaultLogin() {
    helper().login("default", "rock.com");
}
~~~

Run the tests again, they should pass.

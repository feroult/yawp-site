---
layout: blog
title: React + MOBX + YAWP!
---

One common stack that I've been using to build apps is the [React](https://facebook.github.io/react/) + [MOBX](https://mobx.js.org) + YAWP! combo.

Why?

* React (web or native) takes care of the UI rendering/update
* MOBX makes my stores reactive to changes
* YAWP! objects integrate nicely with MOBX

In this simple tutorial I'll show you how to create a reactive API to automatically save
products to the server as you type.

<!--more-->

The source code of this tutorial can be found [here](https://github.com/feroult/yawp-tutorials/tree/master/react-yawp)

### Setup

#### Node, npm and create-react-app

~~~ bash
npm install create-react-app
~~~

#### Create the project folder structure

~~~ bash
mkdir reactive-yawp
cd reactive-yawp
~~~

#### Create the ReactJS project

~~~ bash
create-react-app react-yawp
mv react-yawp web
cd web
npm install yawp --save
npm install mobx --save
npm install mobx-react --save
~~~

#### Create the yawp backend

~~~ bash
mvn archetype:generate \
    -DarchetypeGroupId=io.yawp \
    -DarchetypeArtifactId=yawp \
    -DarchetypeVersion=LATEST \
    -DgroupId=demo \
    -DartifactId=demo \
    -Dversion=1.0-SNAPSHOT

mv demo api
~~~   

### A simple backend

For this tutorial we will have a very simple API containing a __/produts__ resource
endpoint:

~~~ bash
cd api
mvn yawp:endpoint -Dmodel=product
~~~

Open the created __Product.java__ file and add the __name__ attribute:

~~~ java
@Endpoint(path = "/products")
public class Product {

    @Id
    IdRef<Product> id;

    String name;

}
~~~

## A simple reactive app

Now it is time to create the app logic.

First we create the yawp Product client. Inside the folder __web__ add the following content to the file __Product.js__:

~~~ javascript
import yawp from 'yawp';
import {extendObservable, observe} from 'mobx';

yawp.config(c => {
    // do this only for dev
    c.baseUrl('http://localhost:8080/api');
});

class Product extends yawp('/products') {

    constructor(attrs) {
        super();
        extendObservable(this, attrs);
        observe(this, () => this.save());
    }

}

export default Product;
~~~

Now we create a form to edit products. Change the content of the file __App.js__ to be:

~~~ javascript
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Product from './Product';

class App extends Component {

    product = new Product({name: ''});

    onChange = (event) => {
        this.product.name = event.target.value;
    };

    render() {
        return (
            <div style={{margin: 40}}>
                <form>
                    <input type="text"
                           placeholder="name"
                           value={this.product.name}
                           onChange={this.onChange}/>
                </form>
            </div>
        );
    }
}

export default observer(App);
~~~

### Running the demo

Now that everything is done, lets run and check it out.

In one terminal, run the yawp devserver:

~~~ bash
cd api
mvn yawp:devserver
~~~

In other terminal, run the react devserver:

~~~ bash
cd web
npm start
~~~

Your default browser should open the address __http://localhost:3000__. Just open
the network monitor to check the server requests and then start typing at the name input.
Just notice that everytime you type a letter the product will be automatically persisted
to the server.

### Conclusion

As you can see, this is a very simple setup. But it can be extended to construct
more complex reactive apps that easily interact with your yawp backend in a very
organized way.

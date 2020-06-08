# Vue Chat Runner

A Vue.js component that supports chat-like interface for programming education.

## Development

Before running any scripts, install Node and Yarn on your system.

To install all dependencies, run: 

```
$ yarn install
```

To serve the example web page for development, run:

```
$ yarn dev
```

Check out http://localhost:4000 on your web browser to see the example web page.

To build the library, run:

```
$ yarn build
```

Remember to build-and-commit when you update the project. 

## Import and Use

### Basic usage

The easiest way to use **Vue Chat Runner** is to simply load the bundle script under `./lib` in the distribution. For example:

```html
<script src="lib/vue-chat-runner.bundle.js"></script>
```

Having this script tag, a Vue Chat Runner component can be used after being registrated like this:

```javascript
Vue.component('chat-runner', VueChatRunner)
```

If you want to use VueChatRunner in CommonJS environment, you can require the VueChatRunner component from `./lib/vue-chat-runner.js`. For example:

```javascript
var VueChatRunner = require('vue-chat-runner/lib/vue-chat-runner.js').default;
```

or with `import` syntax, 

```javascript
import VueChatRunner from 'vue-chat-runner/lib/vue-chat-runner.js';
```

For a working example, run `$ yarn dev` script and check out the example web page. This shows the `./index.html` file rendered on the browser with all dependencies ready.

### VueChatRunner

`VueChatRunner` component supports the web-based programming lessons specially designed for the component. This allows users to learn how to programming using Python 3 in a very interactive environment created with an instructor bot. 

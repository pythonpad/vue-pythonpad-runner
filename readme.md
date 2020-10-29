# Vue Pythonpad Runner

A Python 3 programming environment as an embeddable Vue.js component. 
**Vue Pythonpad Runner** allows users to edit and run multi-file Python 3 project based on [Brython Runner](https://github.com/pythonpad/brython-runner). 

This component is designed to serve web-based programming exercises for Python-based CS1 courses; the component supports following educational libraries: [cs1robots](https://github.com/otfried/cs101/blob/master/modules/cs1robots.py), [cs1media](https://github.com/otfried/cs101/blob/master/modules/cs1media.py), and [cs1graphics](http://www.cs1graphics.org/). 

## Demo

See our [demo page](https://pythonpad.github.io) to see `vue-pythonpad-runner` in action.

## Installation

### Node.js

```
$ npm install vue-pythonpad-runner
```

## Usage

### Browser

The easiest way to use **Vue Pythonpad Runner** is to simply load the bundle script under `./lib` in the distribution. For example:

```html
<script src="lib/vue-pythonpad-runner.bundle.js"></script>
```

Having this script tag, a Vue Pythonpad Runner component can be used after being registrated like this:

```javascript
Vue.component('pythonpad-runner', VuePythonpadRunner)
```

### CommonJS

Require the component like this:

```javascript
var VuePythonpadRunner = require('vue-pythonpad-runner').default;
```

or with `import` statement:

```javascript
import VuePythonpadRunner from 'vue-pythonpad-runner';
```

Use the component in vue instances:

```javascript
new Vue({
    components: {
        'vue-pythonpad-runner': VuePythonpadRunner,
    },
});
```

## Import and Use

### Basic usage

```html
<pythonpad-runner 
    id="runner"
    ref="runner"
    v-bind:init-src="src"
    v-bind:init-files="files"
    v-on:save="handleSave"
></pythonpad-runner>
<script>
    new Vue({
        el: '#runner',
        data: {
            src: 'import hello',
            files: {
                'hello.py': {
                    type: 'text',
                    body: 'print("hello world")',
                },
            },
        },
        methods: {
            handleSave(save, done, error) {
                if (save.autosave) {
                    console.log('State autosave is required.');
                } else {
                    console.log('User requested to save the state.');
                }
                console.log('main.py code:', save.code);
                console.log('files:', save.files);
                done();
            }
        }
    })
</script>
```

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

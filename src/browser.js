import VuePythonpadRunner from './core/pythonpad-runner';

var globalRef = (typeof this !== "undefined") ? this : window;

if (module.hot) {
    module.hot.accept('./core/pythonpad-runner', () => {
        console.log('Accepting the updated Vue Pythonpad Runner module!')
    })
}

globalRef.VuePythonpadRunner = VuePythonpadRunner

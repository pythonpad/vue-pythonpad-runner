import VuePythonpadRunner from './core/pythonpad-runner';
import Pythonpad from './browser/pythonpad';

var globalRef = (typeof this !== "undefined") ? this : window;

if (module.hot) {
    module.hot.accept(
        [
            './core/pythonpad-runner',
            './browser/pythonpad',
        ], 
        () => console.log('Accepting the updated Vue Pythonpad Runner module!')
    )
}

globalRef.VuePythonpadRunner = VuePythonpadRunner
globalRef.Pythonpad = Pythonpad
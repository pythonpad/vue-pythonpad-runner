import VueChatRunner from './core/vue-chat-runner';

var globalRef = (typeof this !== "undefined") ? this : window;

if (module.hot) {
    module.hot.accept('./core/vue-chat-runner', () => {
        console.log('Accepting the updated Brython Runner module!')
    })
}

globalRef.VueChatRunner = VueChatRunner

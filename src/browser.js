import VueChatRunner from './core/chat-runner';

var globalRef = (typeof this !== "undefined") ? this : window;

if (module.hot) {
    module.hot.accept('./core/chat-runner', () => {
        console.log('Accepting the updated Vue Chat Runner module!')
    })
}

globalRef.VueChatRunner = VueChatRunner

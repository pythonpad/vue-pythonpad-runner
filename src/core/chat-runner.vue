<template>
    <div class="chat-runner">
        <div class="left-column">
            <div class="material-box">
            </div>
            <div class="chat-box">
                <chat
                    :messages="messages"
                    :agents="lesson.agents"
                ></chat>
            </div>
        </div>
        <div class="right-column">
            <div class="editor-box">
                <editor
                    :code="editorCode"
                    @change="code => editorCode = code"
                ></editor>
            </div>
        </div>
    </div>
</template>
<script>
import './common.css'
import Chat from './chat'
import Editor from './editor'
export default {
    name: 'chat-runner',
    props: [
        'lesson',
    ],
    components: {
        Chat,
        Editor,
    },
    data() {
        return {
            cursor: null,
            messages: [],
            editorCode: '',
        }
    },
    mounted() {
        this.readActions()
    },
    methods: {
        readActions() {
            this.cursor = this.lesson.startActionId
            this.readAction()
        },
        readAction() {
            const action = this.lesson.actions[this.cursor]
            switch (action.type) {
                case 'message':
                    this.handleMessage(action)
                    break

                case 'pause':
                    this.handlePause(action)
                    break

                case 'exit':
                    this.handleExit(action)
                    break
            
                default:
                    break
            }
        },
        handleMessage(action) {
            console.log('handleMessage')
            this.messages.push({
                agentId: action.agentId,
                body: action.body,
            })
            this.cursor = action.nextId
            setTimeout(() => this.readAction(), 500)
        },
        handlePause(action) {

        },
        handleExit(action) {

        },
    },
    watch: {
        
    },
}
</script>
<style scoped>
    .chat-runner {
        width: 100%;
        height: 100%;
    }
    .left-column {
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
    }
    .material-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        border-bottom: 1px solid #ddd;
    }
    .chat-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;        
    }
    .right-column {
        float: right;
        width: 50%;
        height: 100%;
        border-left: 1px solid #ddd;
    }
    .editor-box {
        width: 100%;
        height: 100%;
    }
</style>
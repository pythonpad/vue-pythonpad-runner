<template>
    <div class="chat-runner">
        <div class="left-column">
            <div class="material-box">
            </div>
            <div class="chat-box">
                <chat
                    :staticUrl="staticUrl"
                    :messages="messages"
                    :agents="lesson ? lesson.agents : {}"
                ></chat>
            </div>
        </div>
        <div class="right-column">
            <div class="editor-box">
                <editor
                    :code="editorCode"
                    @change="handleEditorCodeChange"
                    @run="() => runEditorCode()"
                ></editor>
            </div>
        </div>
    </div>
</template>
<script>
import { throttle } from 'throttle-debounce'
import BrythonRunner from 'brython-runner/lib/brython-runner.js'
import Chat from './chat'
import Editor from './editor'
import './common.css'

export default {
    name: 'chat-runner',
    props: [
        'lesson',
        'brythonStaticUrl',
        'staticUrl',
        'initSrc'
    ],
    components: {
        Chat,
        Editor,
    },
    data() {
        return {
            cursor: null,
            messages: [],
            editorCode: this.initSrc,
        }
    },
    created() {
        this.saveEditorCodeTh = throttle(1000, this.saveEditorCode)
        this.initRunner()
    },
    mounted() {
        if (this.lesson) {
            this.readActions()
        }
    },
    methods: {
        initRunner() {
            const messages = this.messages
            const options = {
                codeName: 'main.py', 
                codeCwd: '.',
                staticUrl: this.brythonStaticUrl,
                paths: [
                    `${this.staticUrl}/brythonlib`,
                ],
                stdout: {
                    write(content) {
                        messages.push({
                            type: 'output',
                            outputType: 'stdout',
                            body: content,
                        })
                    },
                    flush() { },
                },
                stderr: {
                    write(content) {
                        messages.push({
                            type: 'output',
                            outputType: 'stderr',
                            body: content,
                        })
                    },
                    flush() { },
                },
                onMsg(type, value) {
                    switch (type) {
                        case 'send_text':
                            messages.push({
                                type: 'output.text',
                                body: value,
                            })
                            break
                    
                        default:
                            break
                    }
                }
            }
            this.runner = new BrythonRunner(options)
        },
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
            this.messages.push({
                type: 'message',
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
        handleEditorCodeChange(code) {
            this.editorCode = code
            this.saveEditorCodeTh()
        },
        saveEditorCode() {
            this.$emit('save-src', this.editorCode)
        },
        async runEditorCode() {
            this.messages.push({
                type: 'system',
                body: '코드를 실행합니다.',
            })
            // this.messages.push({
            //     type: 'line',
            // })
            await this.runner.runCode(this.editorCode)
            // this.messages.push({
            //     type: 'line',
            // })
            // this.messages.push({
            //     type: 'system',
            //     body: '코드 실행이 종료되었습니다.',
            // })
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
        /* height: 50%; */
        height: 0;
        border-bottom: 1px solid #ddd;
    }
    .chat-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        /* height: 50%; */
        height: 100%;
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
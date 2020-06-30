<template>
    <div class="chat-runner">
        <div class="editor-column">
            <div class="column-title-row">
                Code Editor
            </div>
            <div class="editor-box">
                <editor
                    :code="editorCode"
                    @change="handleEditorCodeChange"
                    @run="() => runEditorCode()"
                ></editor>
            </div>
        </div>
        <div class="chat-column">
            <div class="column-title-row">
                Run
            </div>
            <div class="chat-box">
                <chat
                    :staticUrl="staticUrl"
                    :messages="messages"
                    :agents="lesson ? lesson.agents : {}"
                    :inputMode="inputMode"
                    @send-text="text => sendText(text)"
                ></chat>
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
            inputMode: null,
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
            const waitTextInput = () => this.inputMode = 'text'
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

                        case 'receive_text':
                            waitTextInput()
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
            await this.runner.runCode(this.editorCode)
        },
        sendText(text) {
            this.runner.sendMsg('input.text', text)
            this.inputMode = null
            this.messages.push({
                type: 'input.text',
                body: text,
            })
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
        display: flex;
        flex-flow: row nowrap;
    }
    .editor-column {
        position: relative;
        flex: 1 1 auto;
        padding-top: 1.5rem;
        border-right: 1px solid #666;
    }
    .chat-box {
        width: 100%;
        height: 100%;
    }
    .chat-column {
        position: relative;
        width: 32rem;
        max-width: 50%;
        flex: 0 0 auto;
        padding-top: 1.5rem;
    }
    .column-title-row {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1.5rem;
        padding: 0 0.5rem;
        line-height: 1.5rem;
        font-size: 0.8rem;
        background-color: #1f2430;
        color: #ddd;
    }
    .editor-box {
        width: 100%;
        height: 100%;
    }
</style>
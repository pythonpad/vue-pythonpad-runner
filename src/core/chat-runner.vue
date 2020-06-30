<template>
    <div class="chat-runner">
        <div class="column-tabs">
            <div class="column-tab" :class="{'active': activeTabId === 'editor'}" @click="() => (activeTabId = 'editor')">
                코드
            </div>
            <div class="column-tab" :class="{'active': activeTabId === 'chat'}" @click="() => (activeTabId = 'chat')">
                실행 화면
            </div>
        </div>
        <div class="columns">
            <div class="column editor-column" :class="{'active': activeTabId === 'editor'}">
                <div class="column-title-row">
                    코드 에디터
                </div>
                <div class="editor-box">
                    <editor
                        :code="editorCode"
                        @change="handleEditorCodeChange"
                        @run="() => runEditorCode()"
                    ></editor>
                </div>
            </div>
            <div class="column chat-column" :class="{'active': activeTabId === 'chat'}">
                <div class="column-title-row">
                    실행
                </div>
                <div class="chat-box">
                    <chat
                        ref="chat"
                        :staticUrl="staticUrl"
                        :messages="messages"
                        :agents="lesson ? lesson.agents : {}"
                        :inputMode="inputMode"
                        @send-text="text => sendText(text)"
                    ></chat>
                </div>
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
            activeTabId: 'editor',
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
            this.activeTabId = 'chat';
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
        activeTabId() {
            this.$refs.chat.scrollToBottom()
        },
    },
}
</script>
<style scoped>
    .chat-runner {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }
    .column-tabs {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 2rem;
        color: #ddd;
        display: flex;
        flex-flow: row nowrap;
        font-size: 0.8rem;
    }
    .column-tab {
        flex: 0 0 auto;
        width: 50%;
        height: 2rem;
        background-color: #1f2430;
        line-height: 2rem;
        text-align: center;
        opacity: 0.6;
        cursor: pointer;
    }
    .column-tab.active { 
        opacity: 1;
    }
    .columns {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
    }
    .column {
        position: relative;
        padding-top: 1.5rem;
    }
    .editor-column {
        flex: 1 1 auto;
        border-right: 1px solid #666;
    }
    .chat-column {
        width: 32rem;
        max-width: 50%;
        flex: 0 0 auto;
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
    .chat-box {
        width: 100%;
        height: 100%;
    }
    @media (max-width: 800px) {
        .chat-runner {
            padding-top: 2rem;
        }
        .column {
            padding-top: 0;
            display: none;
        }
        .column.active {
            display: block;
        }
        .column-title-row {
            display: none;
        }
        .chat-column {
            flex: 1 1 auto;
            max-width: none;
        }
    }
</style>
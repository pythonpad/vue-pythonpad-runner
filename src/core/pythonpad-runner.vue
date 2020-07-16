<template>
    <div class="pythonpad-runner">
        <div class="toolbar-box">
            <toolbar
                :gettext="gettext"
                :isRunning="isRunning"
                @run="() => runEditorCode()"
                @stop="() => stopRunning()"
                @save="() => $emit('save')"
                @share="() => $emit('share')"
                @reset="() => $emit('reset')"
                @open-file-view="() => (isFileViewOpen = true)"
                @close-file-view="() => (isFileViewOpen = false)"
            ></toolbar>
        </div>
        <!-- <div class="column-tabs">
            <div class="column-tab" :class="{'active': activeTabId === 'editor'}" @click="() => (activeTabId = 'editor')">
                {{ gettext('code') }}
            </div>
            <div class="column-tab" :class="{'active': activeTabId === 'output'}" @click="() => (activeTabId = 'output')">
                {{ gettext('runScreen') }}
            </div>
        </div> -->
        <div class="columns">
            <div class="column editor-column" :class="{'active': activeTabId === 'editor'}">
                <div class="editor-box">
                    <editor
                        :gettext="gettext"
                        :code="editorCode"
                        @change="handleEditorCodeChange"
                    ></editor>
                </div>
            </div>
            <div class="column output-column" :class="{'active': activeTabId === 'output'}">
                <div class="output-box">
                    <console
                        ref="console"
                        :gettext="gettext"
                        :staticUrl="staticUrl"
                        :messages="messages"
                        :inputMode="inputMode"
                        @send-text="text => sendText(text)"
                    ></console>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { throttle } from 'throttle-debounce'
import BrythonRunner from 'brython-runner/lib/brython-runner.js'
import Console from './console'
import Editor from './editor'
import Toolbar from './toolbar'
import Phrase from '../i18n/phrase'
import './common.css'

export default {
    name: 'pythonpad-runner',
    props: [
        'locale',
        'brythonStaticUrl',
        'staticUrl',
        'initSrc'
    ],
    components: {
        Console,
        Editor,
        Toolbar,
    },
    data() {
        return {
            messages: [],
            editorCode: this.initSrc,
            inputMode: null,
            sendInput: null,
            activeTabId: 'editor',
            isRunning: false,
            isFileViewOpen: false,
            gettext: () => '',
        }
    },
    created() {
        this.gettext = (new Phrase(this.locale)).load()
        this.saveEditorCodeTh = throttle(1000, this.saveEditorCode)
        this.messages.push({
            type: 'system',
            body: this.gettext('msg.noOutput') + '\n',
        })
        this.initRunner()
    },
    mounted() {
        
    },
    methods: {
        initRunner() {
            const pushMessage = el => this.messages.push(el)
            const waitTextInput = () => this.inputMode = 'text'
            const waitRawInput = resolve => {
                this.inputMode = 'raw'
                this.sendInput = data => resolve(data)
            }
            const options = {
                codeName: 'main.py', 
                codeCwd: '.',
                staticUrl: this.brythonStaticUrl,
                paths: [
                    `${this.staticUrl}/brythonlib`,
                ],
                stdout: {
                    write(content) {
                        pushMessage({
                            type: 'output',
                            outputType: 'stdout',
                            body: content,
                        })
                    },
                    flush() { },
                },
                stderr: {
                    write(content) {
                        pushMessage({
                            type: 'output',
                            outputType: 'stderr',
                            body: content,
                        })
                    },
                    flush() { },
                },
                stdin: {
                    readline() {
                        return new Promise((resolve, reject) => waitRawInput(resolve))
                    },
                },
                onMsg(type, value) {
                    switch (type) {
                        default:
                            break
                    }
                }
            }
            this.runner = new BrythonRunner(options)
        },
        handleEditorCodeChange(code) {
            this.editorCode = code
            this.saveEditorCodeTh()
        },
        saveEditorCode() {
            this.$emit('save-src', this.editorCode)
        },
        async runEditorCode() {
            if (this.editorCode.trim() === '') {
                return;
            }
            this.messages = []
            this.activeTabId = 'output';
            this.isRunning = true
            const exit = await this.runner.runCode(this.editorCode)
            this.isRunning = false
            if (exit === 0) {
                this.messages.push({
                    type: 'system',
                    body: this.gettext('msg.codeRunDone') + '\n',
                })
            } else {
                this.messages.push({
                    type: 'system',
                    body: this.gettext('msg.errorOnRunning') + '\n',
                })
            }
        },
        stopRunning() {
            this.runner.stopRunning()
            this.sendInput = null
            this.inputMode = null
            this.isRunning = false
            this.messages.push({
                type: 'system',
                body: this.gettext('msg.codeRunStopped') + '\n',
            })
        },
        sendText(text) {
            if (this.inputMode === 'raw') {
                this.sendInput(text)
                this.messages.push({
                    type: 'input',
                    body: `${text}\n`,
                })
                this.sendInput = null
                this.inputMode = null
            }
        },
    },
    watch: {
        activeTabId() {
            this.$refs.console.scrollToBottom()
        },
    },
}
</script>
<style scoped>
    .pythonpad-runner {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        padding-bottom: 2.5rem;
    }
    .toolbar-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2.5rem;
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
    }
    .editor-column {
        flex: 1 1 auto;
    }
    .output-column {
        width: 32rem;
        max-width: 50%;
        flex: 0 0 auto;
    }
    .editor-box {
        width: 100%;
        height: 100%;
    }
    .output-box {
        width: 100%;
        height: 100%;
    }
    @media (max-width: 800px) {
        .column {
            display: none;
        }
        .column.active {
            display: block;
        }
        .output-column {
            flex: 1 1 auto;
            max-width: none;
        }
    }
</style>
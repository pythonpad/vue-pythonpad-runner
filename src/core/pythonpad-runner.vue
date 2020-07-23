<template>
    <div class="pythonpad-runner">
        <div class="toolbar-box">
            <toolbar
                :gettext="gettext"
                :isRunnerReady="isRunnerReady"
                :isRunning="isRunning"
                :isSaving="isSaving"
                :isSaved="isCodeSaved && isFilesSaved"
                :viewMode="viewMode"
                :isFileViewOpen="isFileViewOpen"
                :isFilesTooBig="isFilesTooBig"
                @run="() => runEditorCode()"
                @stop="() => stopRunning()"
                @save="handleSave"
                @share="() => $emit('share')"
                @reset="() => $emit('reset')"
                @open-file-view="() => (isFileViewOpen = true)"
                @close-file-view="() => (isFileViewOpen = false)"
                @set-view-mode="viewMode => setViewMode(viewMode)"
            ></toolbar>
        </div>
        <div class="columns">
            <div class="column full-column editor-column" :class="`${viewMode}-mode`">
                <div class="editor-columns">
                    <div 
                        class="column file-browser-column" 
                        :class="{'is-hidden': !isFileViewOpen}"
                    >
                        <div class="fill-parent">
                            <file-browser
                                :gettext="gettext"
                                :files="files"
                                :activeFileKey="activeFileKey"
                                @active-file-key-change="fileKey => handleFileKeyChange(fileKey)"
                                @create-file="handleCreateFile"
                                @rename-file="handleRenameFile"
                                @delete-file="handleDeleteFile"
                                @add-file="handleAddFile"
                            ></file-browser>
                        </div>
                    </div>
                    <div class="column full-column editor-column">
                        <div 
                            class="fill-parent"
                            :class="{'is-hidden': activeFileKey !== 'main.py' }"
                        >
                            <editor
                                :gettext="gettext"
                                :code="editorCode"
                                :filename="`main.py`"
                                @run="() => runEditorCode()"
                                @save="handleSave"
                                @change="handleEditorCodeChange"
                            ></editor>
                        </div>
                        <div 
                            class="fill-parent"
                            v-if="isTextFileVisible"
                        >
                            <editor
                                :gettext="gettext"
                                :code="files[activeFileKey].body"
                                :filename="activeFileKey"
                                @run="() => runEditorCode()"
                                @save="handleSave"
                                @change="body => handleTextFileChange(activeFileKey, body)"
                            ></editor>
                        </div>
                        <div 
                            class="fill-parent"
                            v-else-if="isBinaryFileVisible"
                        >
                            <file-viewer
                                :gettext="gettext"
                                :body="files[activeFileKey].body"
                                :filename="activeFileKey"
                            ></file-viewer>
                        </div>
                    </div>
                </div>
            </div>
            <div ref="outputColumn" class="column output-column" :class="`${viewMode}-mode`">
                <div class="fill-parent">
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
import FileBrowser from './file-browser'
import FileViewer from './file-viewer'
import Toolbar from './toolbar'
import Phrase from '../i18n/phrase'
import './common.css'

const FILES_SIZE_LIMIT = 2000000 // About 1.5MB

export default {
    name: 'pythonpad-runner',
    props: [
        'locale',
        'brythonStaticUrl',
        'staticUrl',
        'initSrc',
        'initFiles',
    ],
    components: {
        Console,
        Editor,
        FileBrowser,
        FileViewer,
        Toolbar,
    },
    data() {
        return {
            messages: [],
            editorCode: this.initSrc,
            files: this.initFiles,
            inputMode: null,
            sendInput: null,
            activeFileKey: 'main.py',
            isRunnerReady: false,
            isSaving: false,
            isCodeSaved: true,
            isFilesSaved: true,
            isRunning: false,
            isFileViewOpen: false,
            isFilesTooBig: false,
            viewMode: 'basic',
            gettext: () => '',
        }
    },
    created() {
        this.gettext = (new Phrase(this.locale)).load()
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
            const setFile = (filename, data) => {
                if (filename === 'main.py') {
                    this.editorCode = data.body
                    this.isCodeSaved = false
                    this.$emit('edit-code', this.editorCode)
                } else {
                    Vue.set(this.files, filename, {
                        type: data.type,
                        body: data.body,
                    })
                    this.isFilesSaved = false
                    this.$emit('edit-files', this.files)
                }
            }
            const setRunnerReady = () => this.isRunnerReady = true
            const options = {
                codeName: '__main__', 
                codeCwd: '.',
                staticUrl: this.brythonStaticUrl,
                files: {},
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
                },
                onFileUpdate(filename, data) {
                    setFile(filename, data)
                },
                onInit() {
                    setRunnerReady()
                },
            }
            this.runner = new BrythonRunner(options)
        },
        handleEditorCodeChange(code) {
            this.editorCode = code
            this.isCodeSaved = false
            this.$emit('edit-code', this.editorCode)
        },
        handleTextFileChange(fileKey, body) {
            Vue.set(this.files, fileKey, {
                type: 'text',
                body: body,
            })
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        handleFileKeyChange(fileKey) {
            this.activeFileKey = fileKey
        },
        handleSave() {
            if (this.isFilesTooBig || this.isSaved) {
                return
            }
            const done = () => {
                this.isSaving = false
                this.isFilesSaved = true
                this.isCodeSaved = true
            }
            const error = () => {
                this.isSaving = false
            }
            const saveObj = {}
            if (!this.isCodeSaved) {
                saveObj.code = this.editorCode
            }
            if (!this.isFilesSaved) {
                saveObj.files = this.files
            }
            this.isSaving = true
            this.$emit('save', saveObj, done, error)
        },
        handleCreateFile(filename) {
            Vue.set(this.files, filename, {
                type: 'text',
                body: '',
            })
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        handleRenameFile(filename, newFilename) {
            Vue.set(this.files, newFilename, {
                type: this.files[filename].type,
                body: this.files[filename].body,
            })
            if (this.activeFileKey === filename) {
                this.activeFileKey = newFilename
            }
            Vue.delete(this.files, filename)
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        handleDeleteFile(filename) {
            if (this.activeFileKey === filename) {
                this.activeFileKey = 'main.py'
            }
            Vue.delete(this.files, filename)
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        handleAddFile(filename, fileObject) {
            Vue.set(this.files, filename, fileObject)
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        setViewMode(viewMode) {
            this.viewMode = viewMode
        },
        async runEditorCode() {
            if (this.editorCode.trim() === '') {
                return;
            }
            this.showOutputColumn()
            this.messages = []
            this.isRunning = true
            const exit = await this.runner.runCodeWithFiles(
                this.editorCode,
                this.files,
            )
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
            if (!this.isFilesSaved) {
                this.handleSave()
            }
        },
        stopRunning() {
            this.isRunnerReady = false
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
        checkFileSize() {
            let s = this.editorCode.length
            for (const [key, value] of Object.entries(this.files)) {
                s += value.body.length
            }
            if (s > FILES_SIZE_LIMIT) {
                this.isFilesTooBig = true
            } else {
                this.isFilesTooBig = false
            }
        },
        showOutputColumn() {
            if (this.$refs.outputColumn.offsetParent === null) {
                this.viewMode = 'run'
            }
        },
    },
    watch: {
        viewMode(value, oldValue) {
            if (oldValue === 'editor' && value !== 'editor') {
                this.$refs.console.scrollToBottom()
            }
        },
        files(value, oldValue) {
            this.checkFileSize()
        },
        editorCode(value, oldValue) {
            this.checkFileSize()
        },
    },
    computed: {
        isTextFileVisible() {
            return (
                this.activeFileKey !== 'main.py' &&
                this.files.hasOwnProperty(this.activeFileKey) && 
                this.files[this.activeFileKey].type === 'text'
            )
        },
        isBinaryFileVisible() {
            return (
                this.activeFileKey !== 'main.py' &&
                this.files.hasOwnProperty(this.activeFileKey) && 
                this.files[this.activeFileKey].type === 'base64'
            )
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
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2.5rem;
        z-index: 500;
    }
    .columns {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
    }
    .editor-columns {
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: row nowrap;
    }
    .column {
        position: relative;
    }
    .file-browser-column {
        width: 16rem;
        max-width: 50%;
        flex: 0 0 auto;
        background-color: #333333;
    }
    .full-column {
        flex: 1 1 auto;
    }
    .editor-column {
        flex: 1 1 auto;
        background-color: #2e3440;
    }
    .editor-column.run-mode {
        display: none;
    }
    .output-column {
        width: 32rem;
        max-width: 40%;
        flex: 0 0 auto;
    }
    .output-column.run-mode {
        flex: 1 1 auto;
        max-width: none;
    }
    .output-column.editor-mode {
        display: none;
    }
    .fill-parent {
        width: 100%;
        height: 100%;
    }
    .is-hidden {
        display: none;
    }
    @media (max-width: 800px) {
        .pythonpad-runner {
            padding-bottom: 2rem;
        }
        .toolbar-box {
            height: 2rem;
        }
        .output-column.basic-mode {
            display: none;
        }
        .file-browser-column {
            min-width: 10rem;
            width: 25%;
            max-width: 16rem;
            flex: 0 0 auto;
        }
    }
    @media (max-width: 480px) {
        .pythonpad-runner {
            height: auto;
        }
        .fill-parent {
            height: auto;
        }
    }
</style>
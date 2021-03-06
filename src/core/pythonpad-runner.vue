<template>
    <div class="pythonpad-runner">
        <div class="toolbar-box" :class="{'is-framed': !fullscreen}">
            <toolbar
                :gettext="gettext"
                :isRunnerReady="isRunnerReady"
                :isRunning="isRunning"
                :isSaving="isSaving"
                :isSaved="isCodeSaved && isFilesSaved"
                :viewMode="viewMode"
                :isFileViewOpen="isFileViewOpen"
                :isFilesTooBig="isFilesTooBig"
                :isGradable="isGradable"
                :isPassed="isPassed"
                :buttons="buttons || []"
                @run="() => runMain()"
                @grade="() => runGrader()"
                @stop="() => stopRunning()"
                @save="handleSave"
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
                                @create-dir="handleCreateDir"
                                @rename-file="handleRenameFile"
                                @move-file="handleMoveFile"
                                @delete-file="handleDeleteFile"
                                @add-file="handleAddFile"
                            ></file-browser>
                        </div>
                    </div>
                    <div v-if="isEditorVisible" class="column full-column editor-column">
                        <div 
                            class="fill-parent"
                            :class="{'is-hidden': activeFileKey !== 'main.py' }"
                        >
                            <editor
                                :gettext="gettext"
                                :code="editorCode"
                                :filename="`main.py`"
                                :editorOptions="editorOptions"
                                @run="() => runMain()"
                                @save="handleSave"
                                @copy-pad="handleCopyPad"
                                @paste-pad="handlePastePad"
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
                                :editorOptions="editorOptions"
                                @run="() => runMain()"
                                @save="handleSave"
                                @copy-pad="handleCopyPad"
                                @paste-pad="handlePastePad"
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
                <div :class="{ 'output-wrapper': isScreen, 'fill-parent': !isScreen }">
                    <div v-if="isScreen" class="screen-box">
                        <div ref="screen" class="screen">
                        </div>
                    </div>
                    <div :class="{ 'console-box': isScreen, 'fill-parent': !isScreen }">
                        <console
                            ref="console"
                            :gettext="gettext"
                            :messages="messages"
                            :inputMode="inputMode"
                            @send-text="text => sendText(text)"
                        ></console>
                    </div>
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
import { errorDataUrl, isImageFilename, toDataUrl } from '../utils/image-conv'
import Phrase from '../i18n/phrase'
import RobotDrawHelper from '../brythonlib/cs1robots/index'
import CanvasDrawHelper from '../brythonlib/cs1graphics/index'
import { showPicture } from '../brythonlib/cs1media'
import { hasCs1media } from '../utils/code'
import { getFilesWithImageProps } from '../utils/image-conv'
import robotsModule from '!!raw-loader!../modules/cs1robots.brython.js'
import mediaModule from '!!raw-loader!../modules/cs1media.brython.js'
import graphicsModule from '!!raw-loader!../modules/cs1graphics.brython.js'
import gradepadModule from '!!raw-loader!../modules/gradepad.brython.js'
import './common.css'

const FILES_SIZE_LIMIT = 2000000 // About 1.5MB

function loadFromStorage(key, defaultItem) {
    const itemString = window.localStorage.getItem(key)
    if (itemString === null) {
        if (defaultItem) {
            saveToStorage(key, JSON.stringify(defaultItem))
            return defaultItem
        } else {
            return null
        }
    } else {
        return JSON.parse(itemString)
    }
}

function saveToStorage(key, item) {
    return window.localStorage.setItem(key, JSON.stringify(item))
}

export default {
    name: 'pythonpad-runner',
    props: [
        'locale',
        'hangerUrl',
        'paths',
        'initSrc',
        'initFiles',
        'buttons',
        'fullscreen',
        'maxFiles',
        'editorOptions'
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
            stdoutLog: [],
            stderrLog: [],
            editorCode: this.initSrc,
            files: this.initFiles,
            inputMode: null,
            sendInput: null,
            activeFileKey: 'main.py',
            isRunnerReady: false,
            isSaving: false,
            isCodeSaved: true,
            isFilesSaved: true,
            isLogging: false,
            isRunning: false,
            isGrading: false,
            isPostrun: false,
            isScreen: false,
            isEditorVisible: true,
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
            const getOutputType = () => {
                if (this.isGrading) {
                    return 'grader'
                } else if (this.isPostrun) {
                    return 'postrun'
                } else {
                    return 'stdout'
                }
            }
            const pushStdOut = content => {
                if (this.isLogging) {
                    this.stdoutLog.push(content)
                }
                this.messages.push({
                    type: 'output',
                    outputType: getOutputType(),
                    body: content,
                })
            }
            const pushStdErr = content => {
                if (this.isLogging) {
                    this.stderrLog.push(content)
                }
                this.messages.push({
                    type: 'output',
                    outputType: 'stderr',
                    body: content,
                })
            }
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
            const enableScreen = callback => {
                if (this.isScreen) {
                    this.$refs.screen.innerHTML = ''
                } else {
                    this.isScreen = true
                }
                this.$nextTick(() => callback(this.$refs.screen))
            }
            const initRobotDrawHelper = () => {
                enableScreen(screenElement => {
                    this.robotDrawHelper = new RobotDrawHelper(screenElement)
                })
            }
            const drawRobot = msg => {
                this.robotDrawHelper.draw(msg)
            }
            const showPictureOnScreen = value => {
                enableScreen(screenElement => {
                    showPicture(screenElement, value)
                })
            }
            const initCanvasDrawHelper = () => {
                enableScreen(screenElement => {
                    this.canvasDrawHelper = new CanvasDrawHelper(screenElement)
                })
            }
            const drawCanvas = task => {
                if (task.drawable && task.drawable.type === 'image') {
                    // Augment drawable with data URL when drawing an image.
                    if (!isImageFilename(task.drawable.filename)) {
                        task.drawable.dataUrl = errorDataUrl
                        pushStdErr(`unable to load image file: ${task.drawable.filename}`)
                    } else {
                        task.drawable.dataUrl = toDataUrl(task.drawable.filename, this.files[task.drawable.filename].body)
                    }
                }
                this.canvasDrawHelper.draw(task)
            }
            const options = {
                codeName: '__main__', 
                codeCwd: '.',
                paths: this.paths || [],
                postInitModules: [
                    robotsModule,
                    mediaModule,
                    graphicsModule,
                    gradepadModule,
                ],
                stdout: {
                    write(content) {
                        pushStdOut(content)
                    },
                    flush() { },
                },
                stderr: {
                    write(content) {
                        pushStdErr(content)
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
                        case 'screen.cs1robot.init':
                            initRobotDrawHelper()
                            break

                        case 'screen.cs1robot.draw':
                            drawRobot(value)
                            break

                        case 'screen.cs1media.show':
                            showPictureOnScreen(value)
                            break

                        case 'screen.cs1graphics.init':
                            initCanvasDrawHelper()
                            break

                        case 'screen.cs1graphics.draw':
                            drawCanvas(value)
                            break

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
            if (this.hangerUrl) {
                options.hangerUrl = this.hangerUrl
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
        handleSave(options = {}) {
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
            if (options.autosave) {
                saveObj.autosave = true
            }
            this.isSaving = true
            this.$emit('save', saveObj, done, error)
        },
        handleCopyPad() {
            const inputEl = document.createElement('textarea')
            document.body.appendChild(inputEl)
            inputEl.value = JSON.stringify(this.getPad())
            inputEl.select()
            document.execCommand('copy')
            document.body.removeChild(inputEl)
        },
        async handlePastePad() {
            const text = await navigator.clipboard.readText()
            const value = JSON.parse(text)
            this.setPad(value)
        },
        setPad(value) {
            if (value.content && value.files) {
                this.editorCode = value.content
                this.files = value.files
            }
        },
        getPad() {
            return {
                title: 'title',
                content: this.editorCode,
                files: this.files,
            }
        },
        setCode(value) {
            this.editorCode = value
        },
        getCode() {
            return this.editorCode
        },
        handleCreateFile(filename) {
            Vue.set(this.files, filename, {
                type: 'text',
                body: '',
            })
            this.isFilesSaved = false
            this.$emit('edit-files', this.files)
        },
        handleCreateDir(filename) {
            Vue.set(this.files, filename, {
                type: 'dir',
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
        handleMoveFile(filename, targetFilename) {
            const keys = Object.keys(this.files).filter(key => key.startsWith(filename))
            this.activeFileKey = 'main.py'
            for (const key of keys) {
                const newKey = key.replace(filename, targetFilename)
                Vue.set(this.files, newKey, {
                    type: this.files[key].type,
                    body: this.files[key].body,
                })
                Vue.delete(this.files, key)
            }
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
        addTextFile(filename, body, options={}) {
            const fileObject = {
                type: 'text',
                body: body,
            }
            Vue.set(this.files, filename, fileObject)
            if (!options.silent) {
                this.isFilesSaved = false
                this.$emit('edit-files', this.files)
            }
        },
        deleteFile(filename, options={}) {
            if (!this.files.hasOwnProperty(filename)) {
                return
            }
            if (this.activeFileKey === filename) {
                this.activeFileKey = 'main.py'
            }
            Vue.delete(this.files, filename)
            if (!options.silent) {
                this.isFilesSaved = false
                this.$emit('edit-files', this.files)
            }
        },
        setViewMode(viewMode) {
            this.viewMode = viewMode
        },
        async runCode(code, options={}) {
            if (code.trim() === '') {
                return;
            }
            this.showOutputColumn()
            if (!options.preserveOutput) {
                this.isScreen = false
                this.messages = []
            }
            this.isRunning = true

            const isCs1mediaUsed = hasCs1media(code) || hasCs1media(this.editorCode)
            const files = (
                isCs1mediaUsed ? 
                (await getFilesWithImageProps(this.files)) : 
                this.files
            )

            const exit = await this.runner.runCodeWithFiles(
                code,
                {
                    ...files,
                    'main.py': {
                        type: 'text',
                        body: this.editorCode,
                    },
                },
            )
            this.isRunning = false
            if (!options.quiet) {
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
            }
            if (!this.isFilesSaved) {
                this.handleSave({ autosave: true })
            }
            return exit
        },
        async runMain() {
            if (this.files.hasOwnProperty('.postrun.py')) {
                // Handle postrun script if exists.
                this.stdoutLog = []
                this.stderrLog = []
                this.isLogging = true
                const result = await this.runCode(this.editorCode)
                this.isLogging = false
                this.addTextFile('.stdout.log', this.stdoutLog.join(''), { silent: true })
                this.addTextFile('.stderr.log', this.stderrLog.join(''), { silent: true })
                this.addTextFile('.exit.log', `${result}`, { silent: true })
                this.isPostrun = true
                await this.runCode(this.files['.postrun.py'].body, { preserveOutput: true, quiet: true })
                this.isPostrun = false
                this.deleteFile('.stdout.log', { silent: true })
                this.deleteFile('.stderr.log', { silent: true })
                this.deleteFile('.exit.log', { silent: true })
                return result
            } else {
                return await this.runCode(this.editorCode)
            }
        },
        async runGrader() {
            if (!this.files.hasOwnProperty('.grader.py')) {
                return
            } else if (this.files['.grader.py'].type !== 'text') {
                return
            }
            this.isGrading = true
            const result = await this.runCode(this.files['.grader.py'].body)
            this.isGrading = false
            return result
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
            const maxFiles = this.maxFiles || FILES_SIZE_LIMIT
            if (s > maxFiles) {
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
        refreshEditor() {
            this.isEditorVisible = false
            setTimeout(() => {
                this.isEditorVisible = true
            }, 100)
        },
    },
    watch: {
        isFileViewOpen(value, oldValue) {
            saveToStorage('isFileViewOpen', value)
        },
        viewMode(value, oldValue) {
            if (oldValue === 'editor' && value !== 'editor') {
                this.$refs.console.scrollToBottom()
            }
        },
        inputMode(value, oldValue) {
            if (value !== null) {
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
        isGradable() {
            return this.files.hasOwnProperty('.grader.py')
        },
        isPassed() {
            // Check ".passed.json" for the sake of backward compatibility
            return this.files.hasOwnProperty('.passed') || this.files.hasOwnProperty('.passed.json')
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
    .toolbar-box.is-framed {
        position: absolute;
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
    .output-wrapper {
        position: relative;
        padding-top: 20rem;
        width: 100%;
        height: 100%;
    }
    .screen-box {
        position: absolute;
        top: 0;
        left: 0;
        height: 20rem;
        width: 100%;
    }
    .console-box {
        width: 100%;
        height: 100%;
    }
    .screen {
        background-color: #000000;
        width: 100%;
        height: 100%;
    }
    .fill-parent {
        width: 100%;
        height: 100%;
    }
    .is-hidden {
        display: none;
    }
    @media (max-height: 480px) {
        .output-wrapper {
            padding-top: 10rem;
        }
        .screen-box {
            height: 10rem;
        }
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
        .output-wrapper {
            padding-top: 0;
            padding-bottom: 20rem;
        }
        .screen-box {
            position: fixed;
            top: auto;
            bottom: 2rem;
            height: 20rem;
            z-index: 500;
        }
    }
    @media (max-width: 480px) and (max-height: 480px) {
        .output-wrapper {
            padding-bottom: 10rem;
        }
        .screen-box {
            height: 10rem;
        }
    }
</style>
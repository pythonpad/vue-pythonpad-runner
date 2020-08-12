<template>
    <div class="file-browser">
        <div class="toolbar">
            <div class="toolbar-group">
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || selectedFileKeys.length > 1}"
                    @click="handleCreateFile"
                >
                    <i class="fa fa-file-o"></i>
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || selectedFileKeys.length > 1}"
                    @click="handleCreateDir"
                >
                    <i class="fa fa-folder-o"></i>
                </button>
                <button
                    v-if="isAddingFile"
                    class="tool-button is-disabled"
                >
                    <i class="fa fa-spinner fa-spin"></i>
                </button>
            </div>
            <div>
                <button 
                    v-if="showHiddenFile"
                    class="tool-button"
                    :class="{'is-disabled': isEditing}"
                    @click="() => (showHiddenFile = false)"
                >
                    <i class="fa fa-eye-slash"></i>
                </button>
                <button 
                    v-else
                    class="tool-button"
                    :class="{'is-disabled': isEditing}"
                    @click="() => (showHiddenFile = true)"
                >
                    <i class="fa fa-eye"></i>
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || selectedFileKeys.length > 1 || selectedFileKeys[0] === 'main.py'}"
                    @click="handleRenameFile"
                >
                    <i class="fa fa-pencil"></i>
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || selectedFileKeys.includes('main.py')}"
                    @click="handleDeleteFile"
                >
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <div v-if="deleteFileKeys !== null" class="confirm">
            <i class="list-icon fa fa-exclamation-triangle"></i>
            <div v-if="deleteFileKeys.length === 1" class="message">
                {{ gettext('msg.deleteConfirm', { filename: getFilename(deleteFileKeys[0]) }) }}
            </div>
            <div v-else class="message">
                {{ gettext('msg.deleteNumberConfirm', { count: deleteFileKeys.length }) }}
            </div>
            <button class="list-button" @click="handleEditorOk">
                <i class="fa fa-check"></i>
            </button>
            <button class="list-button" @click="handleEditorCancel">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div 
            class="files"
            :class="{
                'dragtarget': dragTargetFileKey === '',
            }"
            @drop.prevent="e => handleDrop(e, '')" 
            @dragover.prevent="e => handleDragover(e, '')"
            @dragleave.prevent="e => handleDragleave(e, '')"
        >
            <file-browser-dir
                :gettext="gettext"
                :files="files"
                :fileKey="''"
                :depth="0"
                :activeFileKey="activeFileKey"
                :expandedFileKeys="expandedFileKeys"
                :selectedFileKeys="selectedFileKeys"
                :dragTargetFileKey="dragTargetFileKey"
                :showHiddenFile="showHiddenFile"
                :createFileParentKey="createFileParentKey"
                :createDirParentKey="createDirParentKey"
                :renameFileKey="renameFileKey"
                :deleteFileKeys="deleteFileKeys"
                @editor-ok="editorText => handleEditorOk(editorText)"
                @editor-cancel="() => handleEditorCancel()"
                @expand="fileKey => handleExpand(fileKey)"
                @collapse="fileKey => handleCollapse(fileKey)"
                @select="fileKeys => handleSelect(fileKeys)"
                @drop="(e, fileKey) => handleDrop(e, fileKey)"
                @dragover="(e, fileKey) => handleDragover(e, fileKey)"
                @dragleave="(e, fileKey) => handleDragleave(e, fileKey)"
            ></file-browser-dir>
        </div>
    </div>
</template>
<script>
import FileBrowserDir from './file-browser-dir'
import { isTextFilename } from '../utils/file-type'

export default {
    name: 'file-browser',
    props: [
        'gettext',
        'files',
        'activeFileKey',
    ],
    components: {
        FileBrowserDir,
    },
    data() {
        return {
            expandedFileKeys: [],
            selectedFileKeys: ['main.py'],
            dragTargetFileKey: null,
            showHiddenFile: false,
            isEditing: false,
            createFileParentKey: null,
            createDirParentKey: null,
            renameFileKey: null,
            deleteFileKeys: null,
            isCreatingFile: false,
            isRenamingFile: false,
            isDeletingFile: false,
            isAddingFile: false,
            isFileDraggedOver: false,
            deletingFileKey: '',
            renamingFileKey: '',
            editorText: '',
        }
    },
    methods: {
        isHiddenFile(fileKey) {
            return this.getFilename(fileKey).startsWith('.')
        },
        getFilename(fileKey) {
            const tokens = fileKey.split('/')
            return (tokens[tokens.length - 1] || tokens[tokens.length - 2])
        },
        handleExpand(fileKey) {
            if (!this.expandedFileKeys.includes(fileKey)) {
                this.expandedFileKeys.push(fileKey)
            }
        },
        handleCollapse(fileKey) {
            this.expandedFileKeys = this.expandedFileKeys.filter(key => key !== fileKey)
        },
        handleSelect(fileKeys) {
            if (this.isEditing) {
                this.handleEditorCancel()
            }
            // Handle the case where fileKeys is a single string value -- for compatibility.
            if (Array.isArray(fileKeys) && fileKeys.length > 1) {
                if (fileKeys.includes(this.selectedFileKeys[0])) {
                    this.selectedFileKeys = [
                        this.selectedFileKeys[0],
                        ...fileKeys.filter(key => key !== this.selectedFileKeys[0])
                    ]
                } else {
                    this.selectedFileKeys = fileKeys
                }
            } else {
                const fileKey = Array.isArray(fileKeys) ? fileKeys[0] : fileKeys
                this.selectedFileKeys = [fileKey]
                if (fileKey === 'main.py' || this.files[fileKey].type !== 'dir') {
                    this.$emit('active-file-key-change', fileKey)
                } else {
                    if (this.expandedFileKeys.includes(fileKey)) {
                        this.handleCollapse(fileKey)
                    } else {
                        this.handleExpand(fileKey)
                    }
                }
            }
        },
        handleEditorOk(editorText) {
            let fileKey = editorText
            if (this.createFileParentKey !== null) {   
                if (this.createFileParentKey) {
                    fileKey = this.createFileParentKey + fileKey
                }
                this.$emit('create-file', fileKey)
                if (this.isHiddenFile(editorText)) {
                    this.showHiddenFile = true
                }
                this.createFileParentKey = null
            } else if (this.createDirParentKey !== null) {
                if (this.createDirParentKey !== null) {
                    fileKey = this.createDirParentKey + fileKey + '/'
                }
                this.$emit('create-dir', fileKey)
                if (this.isHiddenFile(editorText)) {
                    this.showHiddenFile = true
                }
                this.createDirParentKey = null
            } else if (this.renameFileKey !== null) {
                const isDir = this.renameFileKey.endsWith('/')
                const tokens = this.renameFileKey.split('/')
                if (isDir) {
                    tokens.pop()
                }
                tokens.pop()
                fileKey = tokens.join('/') + fileKey + (isDir ? '/' : '')
                if (isDir) {
                    const childKeys = Object.keys(this.files)
                        .filter(key => key.startsWith(this.renameFileKey))
                    childKeys.sort((a, b) => (a < b ? 1 : (a > b ? -1 : 0))) // Sort in descending order.
                    this.selectedFileKeys = ['main.py']
                    for (const key of childKeys) {
                        this.$emit('rename-file', key, key.replace(this.renameFileKey, fileKey))
                    }
                    this.selectedFileKeys = [fileKey]
                } else {
                    this.selectedFileKeys = ['main.py']
                    this.$emit('rename-file', this.renameFileKey, fileKey)
                    this.selectedFileKeys = [fileKey]
                }
                if (this.isHiddenFile(editorText)) {
                    this.showHiddenFile = true
                }
                this.renameFileKey = null
            } else if (this.deleteFileKeys !== null) {
                this.selectedFileKeys = ['main.py']
                this.deleteFileKeys.sort((a, b) => (a < b ? 1 : (a > b ? -1 : 0)))
                for (const deleteFileKey of this.deleteFileKeys) {
                    const isDir = deleteFileKey.endsWith('/')
                    if (isDir) {
                        const childKeys = Object.keys(this.files)
                            .filter(key => key.startsWith(deleteFileKey))
                        childKeys.sort((a, b) => (a < b ? 1 : (a > b ? -1 : 0))) // Sort in descending order.
                        for (const key of childKeys) {
                            this.$emit('delete-file', key)
                        }
                    } else {
                        this.$emit('delete-file', deleteFileKey)
                    }
                }
                this.deleteFileKeys = null
            }
            this.isEditing = false
        },
        handleEditorCancel() {
            this.isEditing = false
            this.createFileParentKey = null
            this.createDirParentKey = null
            this.renameFileKey = null
            this.deleteFileKeys = null
        },
        handleCreateFile() {
            if (this.isEditing || this.selectedFileKeys.length > 1) {
                return
            }
            this.isEditing = true
            if (this.selectedFileKeys[0].includes('/')) {
                const tokens = this.selectedFileKeys[0].split('/')
                tokens.pop()
                this.createFileParentKey = tokens.join('/') + '/'
                this.handleExpand(this.createFileParentKey)
            } else {
                this.createFileParentKey = ''
            }
        },
        handleCreateDir() {
            if (this.isEditing || this.selectedFileKeys.length > 1) {
                return
            }
            this.isEditing = true
            if (this.selectedFileKeys[0].includes('/')) {
                const tokens = this.selectedFileKeys[0].split('/')
                tokens.pop()
                this.createDirParentKey = tokens.join('/') + '/'
                this.handleExpand(this.createDirParentKey)
            } else {
                this.createDirParentKey = ''
            }
        },
        handleRenameFile() {
            if (this.isEditing || this.selectedFileKeys.length > 1 || this.selectedFileKeys[0] === 'main.py') {
                return
            }
            this.isEditing = true
            this.renameFileKey = this.selectedFileKeys[0]
        },
        handleDeleteFile() {
            if (this.isEditing || this.selectedFileKeys.includes('main.py')) {
                return
            }
            this.isEditing = true
            this.deleteFileKeys = this.selectedFileKeys.slice(0)
        },
        handleMoveFile(sourceFileKeys, targetFileKey) {
            for (const sourceFileKey of sourceFileKeys) {
                const tokens = sourceFileKey.split('/')
                const filename = tokens[tokens.length - 1] || (tokens[tokens.length - 2] + '/')
                if (sourceFileKey === (targetFileKey + filename)) {
                    continue
                }
                this.$emit('move-file', sourceFileKey, targetFileKey + filename)
            }
        },
        handleDrop(e, fileKey) {
            this.dragTargetFileKey = null
            const raw = e.dataTransfer.getData('text')
            const filesArray = [...e.dataTransfer.files]
            if (filesArray.length > 0) {
                this.handleDropFile(filesArray, fileKey)
            } else if (raw) {
                const fileKeys = JSON.parse(raw)
                this.handleMoveFile(fileKeys, fileKey)
            }
        },
        handleDragover(e, fileKey) {
            this.dragTargetFileKey = fileKey
        },
        handleDragleave(e, fileKey) {
            this.dragTargetFileKey = null
        },
        async handleDropFile(files, targetFileKey) {
            const toBase64 = file => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    let encoded = reader.result.toString().replace(/^data:(.*,)?/, '')
                    if ((encoded.length % 4) > 0) {
                        encoded += '='.repeat(4 - (encoded.length % 4))
                    }
                    resolve(encoded);
                };
                reader.onerror = error => reject(error)
            })
            const toText = file => new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = () => resolve(reader.result)
                reader.onerror = error => reject(error)
            })
            
            this.isAddingFile = true
            for (const file of files) {
                let textBody = null
                try {
                    textBody = await toText(file)
                } catch (err) {
                    // Skip directory for now.
                    continue
                }
                const isText = file.type.includes('text/') || isTextFilename(file.name)
                const fileKeys = Object.keys(this.files)
                let fileKey = `${targetFileKey}${file.name}`
                let count = 2
                while (fileKeys.includes(fileKey)) {
                    let filename = `${file.name}(${count})`
                    if (file.name.includes('.')) {
                        const tokens = file.name.split('.')
                        const ext = tokens.pop()
                        filename = `${tokens.join('.')}(${count}).${ext}`
                    }
                    fileKey = `${targetFileKey}${filename}`
                    count += 1
                }
                const type = isText ? 'text' : 'base64'
                let body = ''
                try {
                    if (isText) {
                        body = textBody
                    } else {
                        body = await toBase64(file)
                    }
                } catch (err) {}
                this.$emit('add-file', fileKey, { type, body })
                if (this.isHiddenFile(file.name)) {
                    this.showHiddenFile = true
                }
            }
            this.isAddingFile = false
        },
    },
    watch: {
        activeFileKey() {
            this.handleEditorCancel()
        },
    },
    computed: {
        fileKeys() {
            const keys = Object.keys(this.files)
            keys.push('main.py')
            keys.sort()
            return keys
        },
        isEditorTextValid() {
            const isDuplicate = Object.keys(this.files).includes(this.editorText) 
            const isRenamingInit = this.isRenamingFile && (this.renamingFileKey === this.editorText)
            const filenameValidator = /^[^<>:"/\|?*%]*$/
            if (isDuplicate && !isRenamingInit) {
                return false
            } else if (['', '.', '..'].includes(this.editorText)) {
                return false
            } else if (!filenameValidator.test(this.editorText)) {
                return false
            } else {
                return true
            }
        },
    }
}
</script>
<style scoped>
    .file-browser {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #333333;
        color: #ffffff;
        padding-top: 2rem;
    }
    .toolbar {
        position: absolute;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        background-color: #444444;
        padding: 0 0.2rem;
        top: 0;
        left: 0;
        width: 100%;
        height: 2rem;
    }
    .toolbar-group {
        flex: 0 0 auto;
        margin-right: 1rem;
    }
    .toolbar-group:last-of-type {
        margin: 0;
    }
    .tool-button {
        display: inline-block;
        border: 0;
        border-radius: 3px;
        padding: 0 0.35rem;
        margin: 0.2rem 0.05rem;
        background-color: #444444; /* primary-dark color */
        font-size: 0.8rem;
        color: #fff;
        cursor: pointer;
        outline: none;
        height: 1.6rem;
        line-height: 1.6rem;
    }
    .tool-button:not(.is-disabled):hover {
        background-color: #666666;
    }
    .tool-button.is-disabled {
        color: #666;
        cursor: not-allowed;
    }
    .confirm {
        position: absolute;
        top: 2rem;
        left: 0;
        width: 100%;
        display: flex;
        background-color: #444444;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        color: #ffffff;
    }
    .message {
        flex: 1 1 auto;
        padding: 0 0.2rem;
        margin-right: 0.3rem;
        color: #ffffff;
        font-size: 0.8rem;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-all;
    }
    .files {
        padding: 0.2rem 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    .files.dragtarget {
        background-color: #555555;
    }
    @media (max-width: 800px) {
        .editor input {
            flex: 0 0 auto;
            width: calc(100% - 4.5rem);
        }
    }
</style>
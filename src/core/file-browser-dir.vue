<template>
    <div 
        class="file-browser-dir"
        :class="{
            'is-dragged-over': isFileDraggedOver,
        }"
        ref="dir" 
    >
        <div ref="dragImage" class="drag-image">
            {{ dragText }}
        </div>
        <div v-if="isCreatingFile || isCreatingDir" class="editor">
            <i v-if="isCreatingFile" class="list-icon fa fa-file-o"></i>
            <i v-else-if="isCreatingDir" class="list-icon fa fa-folder-o"></i>
            <input 
                type="text" 
                ref="editorInput"
                v-model="editorText" 
                @keyup.13="() => handleEditorOk()"
                @keyup.27="() => handleEditorCancel()"
            />
            <button 
                class="list-button" 
                :class="{'is-disabled': !isEditorTextValid}"
                @click="() => handleEditorOk()"
            >
                <i class="fa fa-check"></i>
            </button>
            <button class="list-button" @click="() => handleEditorCancel()">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <template
            v-for="fileItem in fileItems"
        >
            <div 
                v-if="fileItem.key === renameFileKey" 
                class="editor"
                :key="`${fileItem.key}-editor`"
            >
                <i
                    v-if="fileItem.key === 'main.py'"
                    class="list-icon fa fa-file-code-o"
                ></i>
                <i
                    v-else-if="fileItem.type === 'text'"
                    class="list-icon fa fa-file-text-o"
                ></i>
                <i
                    v-else-if="fileItem.type === 'dir' && isExpanded(fileItem.key)"
                    class="fa fa-folder-open-o"
                ></i>
                <i
                    v-else-if="fileItem.type === 'dir'"
                    class="fa fa-folder-o"
                ></i>
                <input 
                    type="text" 
                    ref="editorInput"
                    v-model="editorText" 
                    @keyup.13="() => handleEditorOk()"
                    @keyup.27="() => handleEditorCancel()"
                />
                <button 
                    class="list-button" 
                    :class="{'is-disabled': !isEditorTextValid}"
                    @click="() => handleEditorOk()"
                >
                    <i class="fa fa-check"></i>
                </button>
                <button class="list-button" @click="() => handleEditorCancel()">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <a
                v-else
                class="file"
                :ref="`${fileItem.key}-file`"
                :class="{
                    'selected': selectedFileKeys.includes(fileItem.key),
                    'active': fileItem.key === activeFileKey,
                    'dragtarget': fileItem.key === dragTargetFileKey,
                    'is-hidden': (!showHiddenFile && fileItem.name.startsWith('.')),
                }"
                :key="`${fileItem.key}-file`"
                :style="{ paddingLeft: `${0.2 + 0.5 * depth}rem`}"
                :draggable="fileItem.key !== 'main.py' ? 'true' : 'false'"
                @click="e => handleClick(e, fileItem)"
                @drop.prevent="e => handleDrop(e, fileItem)" 
                @dragstart="e => handleDragstart(e, fileItem)"
                @dragover.prevent="e => handleDragover(e, fileItem)"
                @dragleave.prevent="e => handleDragleave(e, fileItem)"
            >
                
                <i
                    v-if="fileItem.key === 'main.py'"
                    class="fa fa-file-code-o"
                ></i>
                <i
                    v-else-if="fileItem.type === 'text'"
                    class="fa fa-file-text-o"
                ></i> 
                <i
                    v-else-if="fileItem.type === 'dir' && isExpanded(fileItem.key)"
                    class="fa fa-angle-down"
                ></i>
                <i
                    v-else-if="fileItem.type === 'dir'"
                    class="fa fa-angle-right"
                ></i>
                <i
                    v-else
                    class="fa fa-file-o"
                ></i>
                <span>{{ fileItem.name }}</span>
            </a>
            <file-browser-dir
                v-if="fileItem.type === 'dir' && isExpanded(fileItem.key)"
                :key="`${fileItem.key}-dir`"
                :gettext="gettext"
                :files="files"
                :fileKey="fileItem.key"
                :depth="depth + 1"
                :activeFileKey="activeFileKey"
                :expandedFileKeys="expandedFileKeys"
                :selectedFileKeys="selectedFileKeys"
                :dragTargetFileKey="dragTargetFileKey"
                :showHiddenFile="showHiddenFile"
                :createFileParentKey="createFileParentKey"
                :createDirParentKey="createDirParentKey"
                :renameFileKey="renameFileKey"
                :deleteFileKeys="deleteFileKeys"
                @expand="fileKey => $emit('expand', fileKey)"
                @collapse="fileKey => $emit('collapse', fileKey)"
                @editor-ok="editorText => $emit('editor-ok', editorText)"
                @editor-cancel="() => $emit('editor-cancel')"
                @select="fileKey => $emit('select', fileKey)"
                @drop="(e, fileKey) => $emit('drop', e, fileKey)"
                @dragover="(e, fileKey) => $emit('dragover', e, fileKey)"
                @dragleave="(e, fileKey) => $emit('dragleave', e, fileKey)"
            ></file-browser-dir>
        </template>
    </div>
</template>
<script>
export default {
    name: 'file-browser-dir',
    props: [
        'gettext',
        'files',
        'fileKey',
        'depth',
        'activeFileKey',
        'expandedFileKeys',
        'selectedFileKeys',
        'dragTargetFileKey',
        'showHiddenFile',
        'createFileParentKey',
        'createDirParentKey',
        'renameFileKey',
        'deleteFileKeys',
    ],
    data() {
        return {
            editorText: '',
            isFileDraggedOver: false,
            dragText: '',
        }
    },
    methods: {
        getDragTarget(fileItem) {
            if (fileItem.type !== 'dir') {
                if (this.fileKey) {
                    return this.fileKey 
                } else {
                    return ''
                }
            } else {
                return fileItem.key
            }
        },
        isExpanded(fileKey) {
            return this.expandedFileKeys.includes(fileKey)
        },
        handleClick(e, fileItem) {
            e.preventDefault()
            if (e.shiftKey && (this.selectedFileKeys[0] !== fileItem.key)) {
                if (fileItem.key === 'main.py') {
                    // Ignore.
                } else if (this.fileKeys.includes(this.selectedFileKeys[0])) {
                    const keys = this.sortedFileKeys
                    const x = keys.indexOf(this.selectedFileKeys[0])
                    const y = keys.indexOf(fileItem.key)
                    const newSelectedKeys = keys.slice(Math.min(x, y), Math.max(x, y) + 1)
                    this.$emit('select', newSelectedKeys)
                } else {
                    this.$emit('select', fileItem.key)
                }
            } else if (e.ctrlKey || e.metaKey) {
                if (fileItem.key === 'main.py') {
                    // Ignore.
                } else if (this.selectedFileKeys.includes(fileItem.key)) {
                    // Deselecting the file.
                    const newSelectedKeys = this.selectedFileKeys.filter(key => key !== fileItem.key)
                    this.$emit('select', newSelectedKeys)
                } else if (this.fileKeys.includes(this.selectedFileKeys[0])) {
                    // Adding the file to the selection.
                    const newSelectedKeys = [
                        ...this.selectedFileKeys,
                        fileItem.key,
                    ]
                    this.$emit('select', newSelectedKeys)
                } else {
                    // Ignore.
                }
            } else {
                this.$emit('select', fileItem.key)
            }
        },
        handleEditorOk() {
            if (!this.isEditorTextValid) {
                return
            }
            this.$emit('editor-ok', this.editorText)
            this.editorText = ''
        },
        handleEditorCancel() {
            this.$emit('editor-cancel')
            this.editorText = ''
        },
        handleDrop(e, fileItem) {
            e.stopPropagation()
            this.$emit('drop', e, this.getDragTarget(fileItem))
        },
        handleDragstart(e, fileItem) {
            if (fileItem.key === 'main.py') {
                // Ignore.
            } else if (this.selectedFileKeys.includes(fileItem.key)) {
                e.dataTransfer.setData('text', JSON.stringify(this.selectedFileKeys));
                if (this.selectedFileKeys.length > 1) {
                    this.dragText = `${fileItem.name} + ${this.selectedFileKeys.length - 1}`
                } else {
                    this.dragText = fileItem.name
                }
                e.dataTransfer.setDragImage(this.$refs.dragImage, 0, 0);
            } else {
                e.dataTransfer.setData('text', JSON.stringify([fileItem.key]));
                this.dragText = fileItem.name
                e.dataTransfer.setDragImage(this.$refs.dragImage, 0, 0);
            }
        },
        handleDragover(e, fileItem) {
            e.stopPropagation()
            this.$emit('dragover', e, this.getDragTarget(fileItem))
        },
        handleDragleave(e, fileItem) {
            e.stopPropagation()
            this.$emit('dragleave', e, this.getDragTarget(fileItem))
        },
    },
    watch: {
        createFileParentKey(value, oldValue) {
            if (this.createFileParentKey === this.fileKey) {
                this.editorText = ''
                this.$nextTick(() => {
                    if (this.$refs.editorInput) {
                        if (Array.isArray(this.$refs.editorInput)) {
                            this.$refs.editorInput[0].focus()
                        }
                        this.$refs.editorInput.focus()
                    }
                })
            }
        },
        createFileParentKey(value, oldValue) {
            if (this.createDirParentKey === this.fileKey) {
                this.editorText = ''
                this.$nextTick(() => {
                    if (this.$refs.editorInput) {
                        if (Array.isArray(this.$refs.editorInput)) {
                            this.$refs.editorInput[0].focus()
                        }
                        this.$refs.editorInput.focus()
                    }
                })
            }
        },
        renameFileKey(value, oldValue) {
            if (value && (oldValue !== value)) {
                const tokens = value.split('/')
                this.editorText = tokens[tokens.length - 1] || tokens[tokens.length - 2]
                this.$nextTick(() => {
                    if (this.$refs.editorInput) {
                        if (Array.isArray(this.$refs.editorInput)) {
                            this.$refs.editorInput[0].focus()
                        }
                        this.$refs.editorInput.focus()
                    }
                })
            }
        }
    },
    computed: {
        isCreatingFile() {
            return this.createFileParentKey === this.fileKey
        },
        isCreatingDir() {
            return this.createDirParentKey === this.fileKey
        },
        fileKeys() {
            return Object.keys(this.files)
                .filter(key => {
                    if (this.fileKey) {
                        // Either a file or a directory in this fileKey. 
                        return (
                            key !== this.fileKey &&
                            key.startsWith(this.fileKey) && 
                            [-1, key.length - 1].includes(key.indexOf('/', this.fileKey.length + 1))
                        )
                    } else {
                        // Either a file or a directory in the root.
                        return [-1, key.length - 1].includes(key.indexOf('/'))
                    }
                })
        },
        sortedFileKeys() {
            const keys = this.fileKeys 
            keys.sort((a, b) => (a < b ? -1 : (a > b ? 1 : 0)))
            return keys
        },
        fileItems() {
            const items = this.fileKeys
                .map(key => {
                    const tokens = key.split('/')
                    const name = tokens[tokens.length - 1] || tokens[tokens.length - 2]
                    const type = this.files[key].type
                    return { key, name, type }
                })
            if (!this.fileKey) {
                items.push({
                    key: 'main.py',
                    name: 'main.py',
                    type: 'text',
                })
            }
            
            items.sort((a, b) => (a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)))
            return items
        },
        isEditorTextValid() {
            const isDuplicate = Object.keys(this.files).includes(this.editorText) 
            const isDuplicateDir = Object.keys(this.files).includes(this.editorText + '/') 
            const isRenamingInit = this.isRenamingFile && (this.renamingFileKey === this.editorText)
            const filenameValidator = /^[^<>:"/\|?*%]*$/
            if ((isDuplicate || isDuplicateDir) && !isRenamingInit) {
                return false
            } else if (['', '.', '..'].includes(this.editorText)) {
                return false
            } else if (!filenameValidator.test(this.editorText)) {
                return false
            } else {
                return true
            }
        },
    },
}
</script>
<style scoped>
    .drag-image {
        position: fixed;
        left: 105%;
        display: inline-block;
        border-radius: 4px;
        background-color: #444;
        padding: 0.2rem 0.5rem;
        color: #ddd;
        font-size: 0.8rem;
        white-space: nowrap;
        word-break: keep-all;
    }
    .file {
        display: block;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        color: #ffffff;
        cursor: pointer;
        user-select: none;
    }
    .file.active {
        font-weight: bold;
        color: #1dbcd1;
    }
    .file .fa {
        display: inline-block;
        width: 1rem;
        text-align: center;
    }
    .file:hover {
        background-color: #383838;
    }
    .file.selected {
        background-color: #555555;
    }
    .file.dragtarget {
        background-color: #555555;
        color: #b88b03;
    }
    .is-hidden {
        display: none;
    }
    .editor {
        display: flex;
        background-color: #444444;
        flex-flow: row nowrap;
        align-items: center;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        color: #ffffff;
    }
    .list-icon {
        flex: 0 0 auto;
        padding-right: 0.3rem;
    }
    .editor input {
        flex: 1 1 auto;
        padding: 0 0.2rem;
        margin-right: 0.3rem;
        border: 0;
        outline: none;
        background-color: #222222;
        color: #ffffff;
        font-size: 0.8rem;
        line-height: 1.2rem;
        height: 1.2rem;
        min-width: none;
    }
    .list-button {
        flex: 0 0 auto;
        margin-left: 0.1rem;
        border: 0;
        border-radius: 3px;
        text-align: center;
        background-color: inherit; 
        font-size: 0.8rem;
        color: #ffffff;
        cursor: pointer;
        outline: none;
        width: 1.5rem;
        height: 1.2rem;
        line-height: 1.2rem;
    }
    .list-button:not(.is-disabled):hover {
        background-color: #666666;
    }
    .list-button.is-disabled {
        color: #666666;
        cursor: not-allowed;
    }
    @media (max-width: 800px) {
        .editor input {
            flex: 0 0 auto;
            width: calc(100% - 4.5rem);
        }
    }
</style>
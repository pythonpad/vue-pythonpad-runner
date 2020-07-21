<template>
    <div class="file-browser">
        <div class="toolbar">
            <div class="toolbar-group">
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing}"
                    @click="handleCreateFile"
                >
                    <i class="fa fa-file-o"></i>
                </button>
            </div>
            <div>
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || !activeFileKey || activeFileKey === 'main.py'}"
                    @click="handleRenameFile"
                >
                    <i class="fa fa-pencil"></i>
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-disabled': isEditing || activeFileKey === 'main.py'}"
                    @click="handleDeleteFile"
                >
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="files" ref="files">
            <div v-if="isEditing && !isDeletingFile" class="editor">
                <i class="list-icon fa fa-file-o"></i>
                <input 
                    type="text" 
                    ref="editorInput"
                    v-model="editorText" 
                    @keyup.13="handleEditorOk"
                    @keyup.27="handleEditorCancel"
                />
                <button class="list-button" @click="handleEditorOk">
                    <i class="fa fa-check"></i>
                </button>
                <button class="list-button" @click="handleEditorCancel">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div v-if="isDeletingFile" class="confirm">
                <i class="list-icon fa fa-exclamation-triangle"></i>
                <div class="message">
                    {{ gettext('msg.deleteConfirm', { filename: deletingFileKey }) }}
                </div>
                <button class="list-button" @click="handleEditorOk">
                    <i class="fa fa-check"></i>
                </button>
                <button class="list-button" @click="handleEditorCancel">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <a
                v-for="fileKey in fileKeys"
                class="file"
                :class="{
                    'main': fileKey === 'main.py',
                    'active': fileKey === activeFileKey,
                    'is-hidden': fileKey === renamingFileKey,
                }"
                :key="fileKey"
                @click="() => $emit('active-file-key-change', fileKey)"
            >
                <i
                    v-if="fileKey === 'main.py'"
                    class="fa fa-file-code-o"
                ></i>
                <i
                    v-else-if="files[fileKey].type === 'text'"
                    class="fa fa-file-text-o"
                ></i>
                <i
                    v-else
                    class="fa fa-file-o"
                ></i>
                <span>{{ fileKey }}</span>
            </a>
        </div>
    </div>
</template>
<script>
export default {
    name: 'file-browser',
    props: [
        'gettext',
        'files',
        'activeFileKey',
    ],
    data() {
        return {
            isCreatingFile: false,
            isRenamingFile: false,
            isDeletingFile: false,
            deletingFileKey: '',
            renamingFileKey: '',
            editorText: '',
        }
    },
    methods: {
        handleCreateFile() {
            this.isCreatingFile = true
        },
        handleRenameFile() {
            this.isRenamingFile = true
            this.renamingFileKey = this.activeFileKey
            this.editorText = this.renamingFileKey
        },
        handleDeleteFile() {
            this.isDeletingFile = true
            this.deletingFileKey = this.activeFileKey
        },
        handleEditorOk() {
            if (this.isCreatingFile) {
                this.$emit('create-file', this.editorText)
            } else if (this.isRenamingFile) {
                this.$emit('rename-file', this.renamingFileKey, this.editorText)
            } else if (this.isDeletingFile) {
                this.$emit('delete-file', this.deletingFileKey)
            }
            this.closeEditor()
        },
        handleEditorCancel() {
            this.closeEditor()  
        },
        closeEditor() {
            this.isCreatingFile = false
            this.isRenamingFile = false
            this.isDeletingFile = false
            this.editorText = ''
            this.renamingFileKey = ''
            this.deletingFileKey = ''
        },
    },
    watch: {
        isEditing(value, oldValue) {
            if (value && !oldValue) {
                this.$nextTick(() => {
                    this.$refs.files.scrollTop = 0
                    this.$refs.editorInput.focus()
                })
            }
        },
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
        isEditing() {
            return this.isCreatingFile || this.isRenamingFile || this.isDeletingFile
        }
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
        padding: 0 0.5rem;
        margin: 0.2rem 0.05rem;
        background-color: #444444; /* primary-dark color */
        font-size: 0.8rem;
        color: #fff;
        cursor: pointer;
        outline: none;
        height: 1.6rem;
        line-height: 1.6rem;
    }
    .tool-button:hover {
        background-color: #666666;
    }
    .tool-button.is-disabled {
        color: #666;
        cursor: not-allowed;
    }
    .files {
        padding: 0.2rem 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }
    .file {
        display: block;
        padding: 0.2rem 0.5rem;
        font-size: 0.8rem;
        color: #ffffff;
        cursor: pointer;
    }
    .file.main {
        font-weight: bold;
    }
    .file .fa {
        padding-right: 0.3rem;
    }
    .file:hover {
        background-color: #383838;
    }
    .file.active {
        background-color: #444444;
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
    .list-button:hover {
        background-color: #666666;
    }
    .confirm {
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
    }
</style>
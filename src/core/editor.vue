<template>
    <div class="editor fill">
        <div class="editor-container fill" ref="container"></div>
    </div>
</template>
<script>
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/meta'
import 'codemirror/mode/python/python'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/nord.css'
import 'codemirror/addon/comment/comment'
import 'codemirror/keymap/sublime'

const DEFAULT_OPTIONS = {
    lineNumbers: true,
    lineSeparator: '\n',
    mode: 'python',
    theme: 'nord',
    fontSize: 14,
    indentUnit: 4,
    tabSize: 4,
    indentWithTabs: false,
    lineWrapping: true,
    readOnly: false,
    smartIndent: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    showTrailingSpace: true,
    keyMap: 'sublime',
    extraKeys: {
        'Tab': editor => {
            if (editor.somethingSelected()) {
                editor.indentSelection('add')
            } else {
                editor.replaceSelection(
                    editor.getOption('indentWithTabs') ? '\t' : Array(editor.getOption('indentUnit') + 1).join(' '), 
                    'end', 
                    '+input'
                )
            }
        },
    },
    showInvisibles: true,
}

export default {
    name: 'editor',
    props: [
        'gettext',
        'code',
        'filename',
        'isRunning',
    ],
    data() {
        return {
            value: '',
        }
    },
    mounted() {
        this.initEditor()
        
    },
    methods: {
        initEditor() {
            const container = this.$refs.container
            this.editor = CodeMirror(container, {
                ...DEFAULT_OPTIONS,
                value: this.code,
                mode: this.getMode(),
                extraKeys: {
                    ...DEFAULT_OPTIONS.extraKeys,
                    'Ctrl-S': () => this.$emit('save'),
                    'Cmd-S': () => this.$emit('save'),
                    'Shift-Ctrl-Enter': () => this.$emit('run'),
                    'Shift-Cmd-Enter': () => this.$emit('run'),
                    'Shift-Ctrl-C': () => this.$emit('copy-pad'),
                    'Shift-Cmd-C': () => this.$emit('copy-pad'),
                    'Shift-Ctrl-V': () => this.$emit('paste-pad'),
                    'Shift-Cmd-V': () => this.$emit('paste-pad'),
                }
            });
            this.value = this.code
            this.editor.on('changes', (instance, changeObjs) => {
                const doc = instance.getDoc()
                this.value = doc.getValue()
                this.$emit('change', this.value)
            })
        },
        getMode() {
            if (this.filename.endsWith('.py')) {
                return 'python'
            } else if (this.filename.endsWith('.md')) {
                return 'markdown'
            } else {
                return 'text'
            }
        },
    },
    watch: {
        code() {
            if (this.code !== this.value) {
                const doc = this.editor.getDoc()
                this.value = this.code
                doc.setValue(this.value)
            }
        },
    },
}
</script>
<style scoped>
    .editor {
        position: relative;
    }
    .fill {
        width: 100%;
        height: 100%;
    }
    .editor-container /deep/ .CodeMirror {
        width: 100%;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
    }
    .editor-container /deep/ .CodeMirror-wrap pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all !important;
    }
    @media (max-width: 480px) {
        .fill {
            height: auto;
        }
        .editor-container /deep/ .CodeMirror { 
            height: auto;
            min-height: 10rem;
        }
    }
</style>
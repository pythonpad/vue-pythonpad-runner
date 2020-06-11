<template>
    <div class="editor fill">
        <div class="editor-container fill" ref="container"></div>
        <div class="tool-box">
            <button class="tool-button" @click="">
                코드 실행
            </button>
        </div>
    </div>
</template>
<script>
import CodeMirror from 'codemirror/lib/codemirror'
import 'codemirror/mode/meta'
import 'codemirror/mode/python/python'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/keymap/sublime'

const DEFAULT_OPTIONS = {
    lineNumbers: true,
    lineSeparator: '\n',
    mode: 'python',
    theme: 'ayu-mirage',
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
        Tab: editor => {
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
        'code',
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
            });
            this.value = this.code
            this.editor.on('changes', (instance, changeObjs) => {
                const doc = instance.getDoc()
                this.value = doc.getValue()
                this.$emit('change', this.value)
            })
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
        padding-bottom: 4rem; 
    }
    .fill {
        width: 100%;
        height: 100%;
    }
    .editor-container /deep/ .CodeMirror {
        width: 100%;
        height: 100%;
    }
    .tool-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4rem;
    }
    .tool-button {
        border: 0;
        background-color: #2B73F5;
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        color: #fff;
        font-size: 1rem;
        outline: 0;
        cursor: pointer;
    }
    .tool-button:hover {
        opacity: 0.8
    }
</style>
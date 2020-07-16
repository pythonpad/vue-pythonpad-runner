<template>
    <div class="toolbar">
        <div class="toolbar-side">
            <div class="toolbar-group">
                <button 
                    v-if="isRunning" 
                    class="tool-button is-warning"
                    @click="() => $emit('stop')"
                >
                    <i class="fa fa-stop"></i>
                    {{ gettext('stop') }}
                </button>
                <button 
                    v-else 
                    class="tool-button is-primary"
                    @click="() => $emit('run')"
                >
                    <i class="fa fa-play" ></i>
                    {{ gettext('run') }}
                </button>
            </div>
            <div class="toolbar-group">
                <button class="tool-button" @click="() => $emit('save')">
                    <i class="fa fa-save"></i>
                    {{ gettext('save') }}
                </button>
                <button class="tool-button" @click="() => $emit('share')">
                    <i class="fa fa-share"></i>
                    {{ gettext('share') }}
                </button>
                <button class="tool-button is-danger" @click="() => $emit('reset')">
                    <i class="fa fa-history"></i>
                    {{ gettext('reset') }}
                </button>
            </div>
        </div>
        <div class="toolbar-side">
            <div class="toolbar-group">
                <button 
                    v-if="isFileViewOpen"
                    class="tool-button is-active"
                    @click="() => $emit('close-file-view')"
                >
                    <i class="fa fa-folder"></i>
                    {{ gettext('files') }}
                </button>
                <button 
                    v-else
                    class="tool-button"
                    @click="() => $emit('open-file-view')"
                >
                    <i class="fa fa-folder-open"></i>
                    {{ gettext('files') }}
                </button>
            </div>
            <div class="toolbar-group">
                <button class="tool-button">
                    <i class="fa fa-columns"></i>
                    {{ gettext('basicView') }}
                </button>
                <button class="tool-button">
                    <i class="fa fa-code"></i>
                    {{ gettext('editorView') }}
                </button>
                <button class="tool-button">
                    <i class="fa fa-terminal"></i>
                    {{ gettext('runView') }}
                </button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'toolbar',
    props: [
        'gettext',
        'isRunning',
        'isFileViewOpen',
    ],
}
</script>
<style scoped>
    .toolbar {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        background-color: #444444;
        width: 100%;
        height: 2.5rem;
    }
    .toolbar-side {
        display: flex;
        flex-flow: row nowrap;
        flex: 0 0 auto;
        padding: 0 0.3rem;
        justify-content: start;
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
        margin: 0.3rem 0.05rem;
        background-color: #444444; /* primary-dark color */
        font-size: 0.8rem;
        color: #fff;
        cursor: pointer;
        outline: none;
        height: 1.9rem;
        line-height: 1.9rem;
    }
    .tool-button.is-primary {
        background-color: #2B73F5;
    }
    .tool-button.is-warning {
        background-color: #b88b03;
    }
    .tool-button.is-danger {
        background-color: #a43d3d;
    }
    .tool-button.is-active {
        background-color: #666666;
    }
    .tool-button:hover {
        background-color: #666666;
    }
    .tool-button.is-primary:hover {
        background-color: #5991f8;
    }
    .tool-button.is-warning:hover {
        background-color: #b3912e;
    }
    .tool-button.is-danger:hover {
        background-color: #9e5656;
    }
    .tool-button .fa {
        margin-right: 0.3rem;
    }
    @media (max-width: 800px) {
        .tool-button .fa {
            display: none;
        }
    }
</style>
<template>
    <div class="toolbar">
        <div class="toolbar-side">
            <div class="toolbar-group">
                <button 
                    v-if="!isRunnerReady"
                    class="tool-button is-warning is-disabled"
                >
                    <i class="fa fa-spinner fa-spin"></i>
                    {{ gettext('preparing') }}
                </button>
                <button 
                    v-else-if="isRunning" 
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
                <button v-if="!isFilesTooBig" class="tool-button" @click="() => $emit('save')">
                    <i v-if="isSaving" class="fa fa-spinner fa-spin"></i>
                    <i v-else class="fa fa-save"></i>
                    {{ gettext('save') }}
                </button>
                <button v-else class="tool-button is-danger is-disabled">
                    <i class="fa fa-exclamation-triangle"></i>
                    {{ gettext('tooBig') }}
                </button>
                <button class="tool-button" @click="() => $emit('share')">
                    <i class="fa fa-share"></i>
                    {{ gettext('share') }}
                </button>
                <!-- <button class="tool-button is-danger" @click="() => $emit('reset')">
                    <i class="fa fa-history"></i>
                    {{ gettext('reset') }}
                </button> -->
            </div>
            <div v-if="!isSaved" class="toolbar-group">
                <div class="tool-label is-warning">
                    <i class="fa fa-asterisk"></i>
                    {{ gettext('edited') }}
                </div>
            </div>
        </div>
        <div class="toolbar-side">
            <div 
                class="toolbar-group"
                v-if="['basic', 'editor'].includes(viewMode)"
            >
                <button 
                    v-if="isFileViewOpen"
                    class="tool-button is-active"
                    @click="() => $emit('close-file-view')"
                >
                    <i class="fa fa-folder-open"></i>
                    {{ gettext('files') }}
                </button>
                <button 
                    v-else
                    class="tool-button"
                    @click="() => $emit('open-file-view')"
                >
                    <i class="fa fa-folder"></i>
                    {{ gettext('files') }}
                </button>
            </div>
            <div class="toolbar-group">
                <button 
                    class="tool-button is-hidden-in-mobile"
                    :class="{'is-active': viewMode === 'basic'}"
                    @click="() => $emit('set-view-mode', 'basic')"
                >
                    <i class="fa fa-columns"></i>
                    {{ gettext('basicView') }}
                </button>
                <button 
                    class="tool-button"
                    :class="{
                        'is-active': viewMode === 'editor',
                        'is-active-in-mobile': viewMode === 'basic',
                        'is-highlighted-in-mobile': viewMode === 'run' && !isRunning,
                    }"
                    @click="() => $emit('set-view-mode', 'editor')"
                >
                    <i class="fa fa-code"></i>
                    {{ gettext('editorView') }}
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-active': viewMode === 'run'}"
                    @click="() => $emit('set-view-mode', 'run')"
                >
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
        'isRunnerReady',
        'isRunning',
        'isSaving',
        'isSaved',
        'isFileViewOpen',
        'isFilesTooBig',
        'viewMode',
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
    .tool-label {
        display: inline-block;
        padding: 0 0.5rem;
        margin: 0.3rem 0.05rem;
        font-size: 0.8rem;
        color: #fff;
        height: 1.9rem;
        line-height: 1.9rem;
    }
    .tool-label.is-warning {
        color: #b88b03;
    }
    .tool-label .fa {
        margin-right: 0.3rem;
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
    .tool-button:not(.is-disabled):hover {
        background-color: #666666;
    }
    .tool-button.is-primary:not(.is-disabled):hover {
        background-color: #5991f8;
    }
    .tool-button.is-warning:not(.is-disabled):hover {
        background-color: #b3912e;
    }
    .tool-button.is-danger:not(.is-disabled):hover {
        background-color: #9e5656;
    }
    .tool-button.is-disabled {
        cursor: not-allowed;
    }
    .tool-button .fa {
        margin-right: 0.3rem;
    }
    @media (max-width: 800px) {
        .toolbar {
            height: 2rem;
        }
        .tool-label {
            margin: 0.2rem 0.05rem;
            font-size: 0.8rem;
            height: 1.6rem;
            line-height: 1.6em;
        }
        .tool-button {
            margin: 0.2rem 0.05rem;
            font-size: 0.8rem;
            height: 1.6rem;
            line-height: 1.6rem;
        }
        .tool-button.is-active-in-mobile {
            background-color: #666666;
        }
        .tool-button.is-hidden-in-mobile {
            display: none;
        }
        .tool-button.is-highlighted-in-mobile {
            animation: blink 1s linear infinite;
        }
        @keyframes blink {  
            0% { background-color: #444444; }
            20% { background-color: #2B73F5; }
            80% { background-color: #2B73F5; }
            100% { background-color: #444444; }
        }
        .tool-button .fa:not(.fa-spin) {
            display: none;
        }
        .tool-label .fa:not(.fa-spin) {
            display: none;
        }
    }
</style>
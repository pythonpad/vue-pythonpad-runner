<template>
    <div class="toolbar">
        <div class="toolbar-side">
            <div class="toolbar-group">
                <button 
                    v-if="!isRunnerReady"
                    class="tool-button is-warning is-disabled"
                >
                    <i class="fa fa-spinner fa-spin"></i>
                    <span>{{ gettext('preparing') }}</span>
                </button>
                <button 
                    v-if="isRunning" 
                    class="tool-button is-warning"
                    @click="() => $emit('stop')"
                >
                    <i class="fa fa-stop"></i>
                    <span>{{ gettext('stop') }}</span>
                </button>
                <button 
                    v-if="isRunnerReady && !isRunning" 
                    class="tool-button is-primary"
                    @click="() => $emit('run')"
                >
                    <i class="fa fa-play" ></i>
                    <span>{{ gettext('run') }}</span>
                </button>
                <button 
                    v-if="isRunnerReady && !isRunning && isGradable" 
                    class="tool-button is-success"
                    @click="() => $emit('grade')"
                >
                    <i class="fa fa-check" ></i>
                    <span>{{ gettext('grade') }}</span>
                </button>
            </div>
            <div class="toolbar-group">
                <button v-if="!isFilesTooBig" class="tool-button" @click="() => $emit('save')">
                    <i v-if="isSaving" class="fa fa-spinner fa-spin"></i>
                    <i v-else class="fa fa-save"></i>
                    <span>{{ gettext('save') }}</span>
                </button>
                <button v-else class="tool-button is-danger is-disabled">
                    <i class="fa fa-exclamation-triangle"></i>
                    <span>{{ gettext('tooBig') }}</span>
                </button>
                <button 
                    v-for="button in buttons"
                    class="tool-button"
                    :class="button.class"
                    :key="button.label"
                    @click="() => handleButtonClick(button)"
                >   
                    <i v-if="busyButtonLabels.includes(button.label)" class="fa fa-spinner fa-spin"></i>
                    <i v-else class="fa" :class="`fa-${button.fa}`"></i>
                    <span>{{ button.label }}</span>
                </button>
            </div>
            <div v-if="!isSaved || isPassed" class="toolbar-group">
                <div v-if="!isSaved" class="tool-label is-warning">
                    <i class="fa fa-asterisk"></i>
                    <span>{{ gettext('edited') }}</span>
                </div>
                <div v-if="isPassed" class="tool-label is-success">
                    <i class="fa fa-check"></i>
                    <span>{{ gettext('passed') }}</span>
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
                    <span>{{ gettext('files') }}</span>
                </button>
                <button 
                    v-else
                    class="tool-button"
                    @click="() => $emit('open-file-view')"
                >
                    <i class="fa fa-folder"></i>
                    <span>{{ gettext('files') }}</span>
                </button>
            </div>
            <div class="toolbar-group">
                <button 
                    class="tool-button is-hidden-in-mobile"
                    :class="{'is-active': viewMode === 'basic'}"
                    @click="() => $emit('set-view-mode', 'basic')"
                >
                    <i class="fa fa-columns"></i>
                    <span>{{ gettext('basicView') }}</span>
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
                    <span>{{ gettext('editorView') }}</span>
                </button>
                <button 
                    class="tool-button"
                    :class="{'is-active': viewMode === 'run'}"
                    @click="() => $emit('set-view-mode', 'run')"
                >
                    <i class="fa fa-terminal"></i>
                    <span>{{ gettext('runView') }}</span>
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
        'isGradable',
        'isPassed',
        'viewMode',
        'buttons',
    ],
    data() {
        return {
            busyButtonLabels: [],
        }
    },
    methods: {
        async handleButtonClick(button) {
            this.busyButtonLabels.push(button.label)
            await button.callback()
            this.busyButtonLabels = this.busyButtonLabels
                .filter(label => label !== button.label)
        }
    },
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
        padding: 0 0.3rem;
        margin: 0.3rem 0.05rem;
        font-size: 0.8rem;
        color: #fff;
        height: 1.9rem;
        line-height: 1.9rem;
    }
    .tool-label.is-warning {
        color: #b88b03;
    }
    .tool-label.is-success {
        color: #1db954;
    }
    .tool-label .fa {
        margin-right: 0.2rem;
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
    .tool-button.is-success {
        background-color: #1db954;
    }
    .tool-button.is-primary {
        background-color: #2b73f5;
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
    .tool-button.is-success:not(.is-disabled):hover {
        background-color: #7db18e;
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
            line-height: 1.6rem;
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
        .tool-label span {
            display: none;
        }
        .tool-label .fa {
            margin: 0;
        }
    }
    @media (max-width: 400px) {
        .tool-button .fa:not(.fa-spin) {
            display: inline-block;
            margin: 0;
        }
        .tool-button span {
            display: none;
        }
    }   
</style>
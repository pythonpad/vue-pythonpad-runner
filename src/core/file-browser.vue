<template>
    <div class="file-browser">
        <div class="toolbar">
        </div>
        <div class="files">
            <a
                v-for="fileKey in fileKeys" 
                class="file"
                :class="{
                    'main': fileKey === 'main.py',
                    'active': fileKey === activeFileKey,
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
    computed: {
        fileKeys() {
            const keys = Object.keys(this.files)
            keys.push('main.py')
            keys.sort()
            return keys
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
        background-color: #444444;
        top: 0;
        left: 0;
        width: 100%;
        height: 2rem;
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
</style>
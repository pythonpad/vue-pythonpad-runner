<template>
    <div class="chat-runner">
        <div class="left-column">
            <div class="material-box">
            </div>
            <div class="dialog-box">
                {{lesson}}
            </div>
        </div>
        <div class="right-column">
            <div class="editor-box">
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'chat-runner',
    props: [
        'lesson',
    ],
    data() {
        return {

        }
    },
    mounted() {
        
    },
    methods: {
        
    },
    watch: {
        
    },
}
</script>
<style scoped>
    .chat-runner {
        width: 100%;
        height: 100%;
    }
    .left-column {
        position: relative;
        float: left;
        width: 50%;
        height: 100%;
    }
    .material-box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        border-bottom: 1px solid #ddd;
    }
    .dialog-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;        
    }
    .right-column {
        float: right;
        width: 50%;
        height: 100%;
        border-left: 1px solid #ddd;
    }
</style>
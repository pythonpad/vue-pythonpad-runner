<template>
    <div class="chat fill">
        <div class="chat-container fill">
            <div class="message-box fill" ref="box">
                <div class="message-box-content">
                    <template v-for="(message, i) in messages">
                        <div class="message" v-if="message.type == 'message'" :key="i">
                            <div class="image-column">
                                <img class="message-image" :src="agents[message.agentId].image.replace(/#{static}/g, staticUrl)"></img>
                            </div>
                            <div class="content-column">
                                <div class="message-name">
                                    {{agents[message.agentId].name}}
                                </div>
                                <div class="message-body">
                                    {{message.body}}
                                </div>
                            </div>
                        </div>
                        <div class="message" v-else-if="message.type == 'system'" :key="i">
                            <div class="image-column">
                                <img class="message-image" :src="`${staticUrl}/images/system.png`"></img>
                            </div>
                            <div class="content-column">
                                <div class="message-name">
                                    시스템
                                </div>
                                <div class="message-body">
                                    {{message.body}}
                                </div>
                            </div>
                        </div>
                        <div class="line" v-else-if="message.type == 'line'" :key="i">
                        </div>
                        <code 
                            v-else-if="message.type == 'output'"
                            class="output"  
                            :class="{'error': message.outputType == 'stderr'}"
                            :key="i"
                        >{{message.body}}</code>
                    </template>
                </div>
            </div>
            <div class="input-row-box">
                <div class="input-row-inner-box fill">
                    <div class="input-box fill">
                        <input class="input fill" type="text"></input>
                    </div>
                    <button class="send-button">
                        보내기
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'chat',
    props: [
        'staticUrl',
        'agents',
        'messages',
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
        messages() {
            this.$nextTick(() => {
                const box = this.$refs.box
                box.scrollTo(0, box.scrollHeight);
            })
        }
    },
}
</script>
<style scoped>
    .chat {
        background-color: #eee;
    }
    .fill {
        width: 100%;
        height: 100%;
    }
    .chat-container {
        position: relative;
        margin: 0 auto;
        max-width: 50rem;  
        padding-bottom: 4rem; 
    }
    .message-box {
        overflow-y: scroll;
    }
    .message-box-content {
        padding: 1rem 1rem;
    }
    .item {
        padding: 0;
    }
    .message {
        position: relative;
        padding: 0.5rem 20% 0.5rem 3rem;
    }
    .image-column {
        position: absolute;
        left: 0;
        width: 3rem;
    }
    .message-image {
        width: 3rem;
        height: auto;
        border-radius: 50%;
    }
    .content-column {
        padding-left: 0.8rem;
        width: 100%;
    }
    .message-name {
        padding: 0.5rem 0;
        font-size: 0.8rem;
        color: #444;
    }
    .message-body {
        display: inline-block;
        border-radius: 1rem;
        padding: 0.8rem;
        font-size: 0.8rem;
        background-color: #ddd;
        color: #222;
    }
    .line {
        padding-top: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid #aaa
    }
    .output {
        display: inline;
        padding: 0;
        margin: 0;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .error {
        color: #ff4444;
    }
    .input-row-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4rem;
        /* padding: 0.4rem; */
    }
    .input-row-inner-box {
        position: relative;
        background-color: #fff;
        padding-right: 5rem;
    }
    .input-box {
        padding: 0.5rem;
    }
    .input {
        border: 0;
        outline: 0;;
        line-height: 3rem;
        font-size: 1rem;
    }
    .send-button {
        border: 0;
        background-color: #2B73F5;
        position: absolute;
        top: 0;
        right: 0;
        width: 5rem;
        height: 100%;
        color: #fff;
        font-size: 1rem;
        outline: 0;
        cursor: pointer;
    }
    .send-button:hover {
        opacity: 0.8;
    }
</style>

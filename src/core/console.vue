<template>
    <div class="console fill">
        <div class="output-container fill">
            <div class="message-box fill" ref="box">
                <div class="message-box-content">
                    <div 
                        v-if="messages.length > 2000"
                        class="info system"  
                    >
                        {{ gettext('msg.outputCountLimited', { smart_count: 2000 }) }}
                    </div>
                    <template v-for="(message, i) in visibleMessages">
                        <span 
                            v-if="message.type == 'system'"
                            class="console-text system"  
                            :key="i"
                        >{{message.body}}</span>
                        <span 
                            v-else-if="message.type == 'output'"
                            class="console-text"  
                            :class="{
                                'error': message.outputType == 'stderr',
                                'grader': message.outputType == 'grader',
                                'postrun': message.outputType == 'postrun',
                            }"
                            :key="i"
                        >{{message.body}}</span>
                        <span 
                            v-else-if="message.type == 'input'"
                            class="console-text user-input"  
                            :key="i"
                        >{{message.body}}</span>
                    </template>
                </div>
            </div>
            <div class="input-row-box" :class="{ 'disabled': !inputMode }">
                <div class="input-row-inner-box fill">
                    <div class="input-box fill" :class="{ 'disabled': !inputMode }">
                        <input ref="textInput" class="input fill" type="text" :disabled="!inputMode" v-on:keyup.13="sendText" v-model="inputText"></input>
                    </div>
                    <button class="send-button" :disabled="!inputMode" @click="sendText">
                        {{ gettext('send') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'console',
    props: [
        'gettext',
        'staticUrl',
        'messages',
        'inputMode'
    ],
    data() {
        return {
            inputText: '',
        }
    },
    mounted() {
        
    },
    methods: {
        sendText() {
            const text = this.inputText
            this.inputText = ''
            this.$emit('send-text', text)
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const box = this.$refs.box
                box.scrollTo(0, box.scrollHeight);
                document.body.scrollTo(0, document.body.scrollHeight);
            })
        },
    },
    watch: {
        inputMode() {
            if (this.inputMode === 'raw') {
                this.$nextTick(() => {
                    this.$refs.textInput.focus()
                })
            }
        },
        messages() {
            this.scrollToBottom()
        },
    },
    computed: {
        visibleMessages() {
            if (this.messages.length > 2000) {
                return this.messages.slice(-2000)
            } else {
                return this.messages
            }
        }
    }
}
</script>
<style scoped>
    .console {
        background-color: #222;
        color: #fff;
    }
    .fill {
        width: 100%;
        height: 100%;
    }
    .output-container {
        position: relative;
        margin: 0 auto;
        padding-bottom: 2.5rem; 
    }
    .message-box {
        overflow-y: scroll;
    }
    .message-box-content {
        padding: 1rem 1rem;
    }
    .info {
        padding: 0;
        margin: 0;
        font-family: monospace;
    }
    .console-text {
        display: inline;
        padding: 0;
        margin: 0;
        font-family: monospace;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .error {
        color: #ff4444;
    }
    .grader {
        color: #1db954;
    }
    .postrun {
        color: #1db954;
    }
    .system {
        display: block;
        color: #1dbcd1;
    }
    .user-input {
        color: #ffcc00;
    }
    .input-row-box {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2.5rem;
    }
    .input-row-inner-box {
        position: relative;
        background-color: #fff;
        padding-right: 5rem;
    }
    .input-box {
        padding: 0.5rem;
    }
    .input-box.disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }
    .input {
        border: 0;
        outline: 0;
        padding: 0.35rem 0;
        font-size: 0.8rem;
    }
    .input:disabled {
        background-color: #ddd;
        cursor: not-allowed;
    }
    .send-button {
        border: 0;
        border-radius: 0;
        background-color: #2B73F5;
        position: absolute;
        top: 0;
        right: 0;
        width: 5rem;
        height: 100%;
        color: #fff;
        font-size: 0.8rem;
        outline: 0;
        cursor: pointer;
    }
    .send-button:hover {
        opacity: 0.8;
    }
    .send-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    @media (max-width: 480px) {
        .output-container {
            padding: 0;
        }
        .fill {
            height: auto;
        }
        .input-row-box {
            position: relative;
            padding: 0.5rem 1rem;
            height: auto;
        }
        .input-row-box.disabled {
            display: none;
        }
        .input {
            padding: 0;
        }
    }
</style>

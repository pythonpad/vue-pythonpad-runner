<template>
    <div class="chat">
        <div class="message" 
            v-for="(message, i) in messages"
            :key="i"
        >{{message}}</div>
    </div>
</template>
<script>
export default {
    name: 'chat',
    props: [
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
        
    },
}
</script>
<style scoped>
    .chat {
        width: 100%;
        height: 100%;
    }
</style>
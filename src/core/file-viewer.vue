<template>
    <div class="file-viewer">
        <img v-if="isImageFile" class="image" :src="imageSrc">
        <div v-else class="download-link-container">
            {{ gettext('msg.noPreview') }}
            <a class="download-link" @click="handleDownload">{{ gettext('download') }} ({{ filename }})</a>
        </div>
    </div>
</template>
<script>
import { isImageFilename, toDataUrl } from '../utils/image-conv'

export default {
    name: 'file-viewer',
    props: [
        'gettext',
        'body',
        'filename',
    ],
    methods: {
        getFileExtension() {
            if (!this.filename.includes('.')) {
                return this.filename
            } else {
                const tokens = this.filename.split('.')
                return tokens[tokens.length - 1].toLowerCase()
            }
        },
        handleDownload() {
            const a = document.createElement('a')
            a.href = `data:application/octet-stream;base64,${this.body}`
            a.download = this.filename
            a.click()
        },
    },
    computed: {
        isImageFile() {
            return isImageFilename(this.filename)
        },
        imageSrc() {
            return toDataUrl(this.filename, this.body)
        },
    }
}
</script>
<style scoped>
    .file-viewer {
        width: 100%;
        height: 100%;
    }
    .image {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .download-link-container {
        width: 100%;
        height: 100%;
        padding: 1rem 1rem;
        background-color: #383838;
        color: #ffffff;
        font-size: 0.8rem;
        text-align: center;
    }
    .download-link {
        display: block;
        padding: 1rem 0;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
    }
    .download-link:hover {
        text-decoration: underline;
    }
</style>
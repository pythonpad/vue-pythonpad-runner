import { getFileExtension } from './file-type'

export const IMAGE_EXT_TO_MIME = {
    'apng': 'image/apng',
    'bmp': 'image/bmp',
    'gif': 'image/gif',
    'ico': 'image/x-icon',
    'cur': 'image/x-icon',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'jfif': 'image/jpeg',
    'pjpeg': 'image/jpeg',
    'png': 'image/png',
    'svg': 'image/svg+xml',
    'tiff': 'image/tiff',
    'tif': 'image/tiff',
    'webp': 'image/webp',
}
export const errorDataUrl = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjQsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiDQoJIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjBweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMjAgMTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPHBhdGggZmlsbD0iI0Q2MUYzMyIgZD0iTTEwLDBMMCwxNmgyMEwxMCwweiBNMTEsMTMuOTA4SDl2LTJoMlYxMy45MDh6IE05LDEwLjkwOHYtNmgydjZIOXoiLz4NCjwvc3ZnPg0K'

export function isImageFilename(filename) {
    const ext = getFileExtension(filename)
    return Object.keys(IMAGE_EXT_TO_MIME).includes(ext)
}

export function toDataUrl(filename, data) {
    const mime = IMAGE_EXT_TO_MIME[getFileExtension(filename)]
    return `data:${mime};base64,${data}`
}

export function getImageProps(filename, data) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = toDataUrl(filename, data)
        img.onload = e => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const width = img.width
            const height = img.height
            canvas.width = width 
            canvas.height = height 
            ctx.drawImage(img, 0, 0)
            const rawImageData = ctx.getImageData(0, 0, width, height)
            const imageData = [...rawImageData.data]
            resolve({ width, height, imageData })
        }
    })
}

export async function getFilesWithImageProps(files) {
    const newFiles = {}
    for (const [filename, value] of Object.entries(files)) {
        if (isImageFilename(filename) && value.type === 'base64') {
            newFiles[filename] = {
                ...value,
                ...(await getImageProps(filename, value.body)),
            }
        } else {
            newFiles[filename] = {
                ...value,
            }
        }
    }
    return newFiles
}
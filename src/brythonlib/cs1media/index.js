export function showPicture(el, p) {
    const box = document.createElement('div')
    box.style.width = '100%'
    box.style.height = '100%'
    box.style.backgroundColor = '#ffffff'
    box.style.display = 'flex'
    box.style.alignItems = 'center'
    box.style.justifyContent = 'center'
    const canvas = document.createElement('canvas')
    canvas.width = p.width
    canvas.height = p.height
    canvas.style.maxWidth = '100%'
    canvas.style.maxHeight = '100%'
    canvas.style.flex = '0 0 auto'
    const data = Uint8ClampedArray.from(p.imageData)
    const imageData = new ImageData(data, p.width)
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    box.appendChild(canvas)
    el.appendChild(box)
}

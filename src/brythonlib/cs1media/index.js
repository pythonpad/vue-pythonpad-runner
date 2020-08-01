export function showPicture(el, p) {
    const box = document.createElement('div')
    box.style.width = '100%'
    box.style.height = '100%'
    box.style.backgroundColor = '#ffffff'
    const canvas = document.createElement('canvas')
    canvas.width = p.width
    canvas.height = p.height
    const data = Uint8ClampedArray.from(p.imageData)
    const imageData = new imageData(data, p.width)
    const ctx = canvas.getContext('2d')
    ctx.putImageData(imageData, 0, 0)
    box.appendChild(canvas)
    el.appendChild(box)
}

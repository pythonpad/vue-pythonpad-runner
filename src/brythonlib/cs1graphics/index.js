import CanvasDrawer from './canvas-drawer';

export default class CanvasDrawHelper {
    constructor(el) {
        const box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = '100%'
        box.style.backgroundColor = '#ffffff'
        box.style.display = 'flex'
        box.style.alignItems = 'center'
        box.style.justifyContent = 'center'
        const innerBox = document.createElement('div')
        innerBox.width = p.width // ???
        innerBox.height = p.height
        innerBox.style.maxWidth = '100%'
        innerBox.style.maxHeight = '100%'
        innerBox.style.flex = '0 0 auto'
        box.appendChild(innerBox)
        el.appendChild(box)
        this.drawer = new CanvasDrawer(innerBox)
    }

    draw(msg) {
        this.drawer.onTask(JSON.parse(msg))
    }
}
const SVGNS = 'http://www.w3.org/2000/svg'

export default class CanvasDrawer {
    constructor(containerElement) {
        this.containerElement = containerElement
        this.canvasElement = null
        this.svgElement = null
        this.canvasObject = null
        this.objects = {}
        this.elements = {}
        this.initContainer()
    }

    initContainer() {
        const box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = '100%'
        box.style.backgroundColor = '#ffffff'
        box.style.display = 'flex'
        box.style.alignItems = 'center'
        box.style.justifyContent = 'center'
        this.innerContainerElement = box
        this.containerElement.appendChild(box)
    }

    sanitizeColor(color) {
        if (Array.isArray(color)) {
            if (color.length === 3) {
                return `rgb(${color.join(',')})`
            } else if (color.length === 4) {
                return `rgba(${color.join(',')})`
            }
        }
        return color
    }

    onCreateCanvas(task) {
        this.canvasObject = task.canvas
        this.svgElement = document.createElementNS(SVGNS, 'svg')
        this.svgElement.setAttributeNS(null, 'viewBox', `0 0 ${task.canvas.width} ${task.canvas.height}`)
        this.svgElement.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMid meet')
        const styles = {
            'width': `${task.canvas.width}px`,
            'height': `${task.canvas.height}px`,
            'max-width': '100%',
            'max-height': '100%',
            'flex': '0 0 auto',
            'background-color': this.sanitizeColor(task.canvas.bgColor),
        }
        const styleString = Object.entries(styles).map(kv => `${kv[0]}:${kv[1]}`).join(';')
        this.svgElement.setAttributeNS(null, 'style', styleString)
        this.innerContainerElement.appendChild(this.svgElement)
        this.objects[task.canvas.id] = task.canvas
        this.elements[task.canvas.id] = this.svgElement
    }

    getTagNameByDrawableType(dtype) {
        switch (dtype) {
            case 'rectangle':
                return 'rect'
        
            default:
                return 'rect'
        }
    }

    setDrawableAttributes(el, drawable) {
        if (drawable.type === 'rectangle') {
            el.setAttributeNS(null, 'height', drawable.height)
            el.setAttributeNS(null, 'width', drawable.width)
        }
        el.setAttributeNS(null, 'x', drawable.initx)
        el.setAttributeNS(null, 'y', drawable.inity)
        if (drawable.fillColor) {
            el.setAttributeNS(null, 'fill', this.sanitizeColor(drawable.fillColor))
        }
        if (drawable.borderColor) {
            el.setAttributeNS(null, 'stroke', this.sanitizeColor(drawable.borderColor))
        }
        if (drawable.borderWidth) {
            el.setAttributeNS(null, 'stroke-width', this.sanitizeColor(drawable.borderWidth))
        }
        el.setAttributeNS(null, 'transform', drawable.transform)
    }

    onAdd(task) {
        const tagName = this.getTagNameByDrawableType(task.drawable.type)
        const el = document.createElementNS(SVGNS, 'rect')
        el.id = `d${task.drawable.id}`
        this.setDrawableAttributes(el, task.drawable)
        this.elements[task.container_id].appendChild(el)
        this.objects[task.drawable.id] = task.drawable
        this.elements[task.drawable.id] = el
    }

    onEdit(task) {
        const el = this.elements[task.drawable.id]
        this.setDrawableAttributes(el, task.drawable)
    }

    onTask(task) {
        console.log('TASK', task)
        switch(task.task) {
            case 'create_canvas':
                this.onCreateCanvas(task)
                break

            case 'add':
                this.onAdd(task)
                break

            case 'edit':
                this.onEdit(task)
                break

            default:
                break
        }
    }
}
export default class CanvasDrawer {
    constructor(containerElement) {
        this.containerElement = containerElement
        this.canvasElement = null
        this.svgElement = null
        this.canvasObject = null
        this.objects = {}
    }

    sanitizeColor(color) {
        return color
    }

    onCreateCanvas(task) {
        this.objects[task.canvas.id] = task.canvas
        this.canvasObject = task.canvas
        this.svgElement = document.createElement('svg')
        this.svgElement.xmlns = 'http://www.w3.org/2000/svg'
        this.svgElement.width = task.canvas.width
        this.svgElement.height = task.canvas.height
        this.svgElement.style.backgroundColor = task.canvas.bgColor
        this.containerElement.appendChild(this.svgElement)
    }

    onTask(task) {
        switch(task.task) {
            case 'create_canvas':
                this.onCreateCanvas(task)
                break

            case 'add':
                this.onAdd(task)
                break

            default:
                break
        }
    }
}
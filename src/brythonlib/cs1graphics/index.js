import CanvasDrawer from './canvas-drawer';

export default class CanvasDrawHelper {
    constructor(el) {
        this.drawer = new CanvasDrawer(el)
    }

    draw(msg) {
        this.drawer.onTask(msg)
    }
}
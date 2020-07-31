import RobotDrawer from './robot-drawer';
import './robot-drawer.css';
import './robot-drawer-theme-cocode.css';

export default class RobotDrawHelper {
    constructor(el) {
        const box = document.createElement('div')
        box.style.width = '100%'
        box.style.height = '100%'
        box.style.backgroundColor = '#ffffff'
        el.appendChild(box)
        this.drawer = new RobotDrawer(box)
    }

    draw(msg) {
        this.drawer.onTask(msg)
    }
}
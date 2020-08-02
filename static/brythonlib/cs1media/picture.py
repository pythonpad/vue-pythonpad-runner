import browser
import json
from .color import Color

def sanitize_color(color):
    if isinstance(color, str):
        return list(getattr(Color, color))
    else:
        return color

browser.self.sanitizeColor = sanitize_color

browser.self.eval('''
class Picture {
    constructor(width, height, data, color) {
        this.width = width
        this.height = height
        this.title = ''
        const buffer = new ArrayBuffer(width * height * 4);
        this.data = new Uint8ClampedArray(buffer);
        if (data) {
            this.data.set(data, 0)
        } else {
            const safeColor = color ? self.sanitizeColor(color) : [0, 0, 0]
            for (let i = 0; i < (width * height); i++) {
                this.data.set(safeColor, i * 4)
            }
        }
        for (let i = 0; i < (width * height); i++) {
            this.data[(i * 4) + 3] = 255
        }
    }

    show1() {
        return this.show()
    }

    show() {
        self.sendMsg('screen.cs1media.show', {
            width: this.width,
            height: this.height,
            imageData: this.data
        })
    }

    setPixels(color) {
        const safeColor = color ? self.sanitizeColor(color) : [0, 0, 0]
        for (let i = 0; i < (width * height); i++) {
            this.data.set(safeColor, i * 4)
        }
    }

    setTitle(title) {
        this.title = title
    }

    title() {
        return this.title
    }

    size() {
        return [this.width, this.height]
    }

    getIndex(x, y) {
        return (y * this.width * 4) + (x * 4)
    }

    get(x, y) {
        const i = this.getIndex(x, y)
        const subarray = this.data.subarray(i, i + 3)
        return [subarray[0], subarray[1], subarray[2]]
    }

    set(x, y, color) {
        const safeColor = self.sanitizeColor(color)
        const i = this.getIndex(x, y)
        this.data.set(safeColor, i)
    }

    greet() {
        return 'hello'
    }
}
self.Picture = Picture
''')

class Picture(object):
    def __init__(self, width, height, data=None, color=(0,0,0)):
        self.obj = browser.self.Picture.new(width, height, data, list(color))

    def size(self):
        return self.obj.size()

    def show1(self):
        return self.obj.show1()

    def show(self):
        return self.obj.show()

    def set_pixels(self, color=(0,0,0)):
        return self.obj.setPixels(list(color))

    def set_title(self, title):
        return self.obj.setTitle()

    def title(self):
        return self.obj.title()

    def get(self, x, y):
        return tuple(self.obj.get(x, y))

    def set(self, x, y, color):
        if isinstance(color, str):
            return self.obj.set(x, y, color)
        else:
            return self.obj.set(x, y, list(color))

    def save_as(self, filename=None):
        raise NotImplementedError('cs1media in Pythonpad does not support save_as method.')

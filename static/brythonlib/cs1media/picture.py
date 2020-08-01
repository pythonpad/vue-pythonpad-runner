import browser
import json
from .color import Color

def sanitize_color(color):
    if isinstance(color, str):
        return getattr(Color, color)
    else:
        return color

class Picture(object):
    def __init__(self, width, height, data=None, color=(0,0,0)):
        self.width = width
        self.height = height
        self.title = ''
        if data is not None:
            self.data = data
        else:
            pixel = [v for v in sanitize(color)] + [1]
            self.data = pixel * (width * height)

    def size(self):
        return self.width, self.height

    def show1(self):
        return self.show()

    def show(self):
        picture_dict = {
            'width': self.width,
            'height': self.height,
            'imageData': self.data,
        }
        browser.self.sendMsg('screen.cs1media.show', json.dumps(picture_dict))

    def set_pixels(self, color=(0,0,0)):
        pixel = [v for v in sanitize(color)] + [1]
        self.data = pixel * (self.width * self.height)

    def set_title(self, title):
        self.title = title

    def title(self):
        return self.title

    def get_index(self, x, y):
        return (y * width * 4) + (x * 4)

    def get(self, x, y):
        start = self.get_index(x, y)
        return self.data[start], self.data[start + 1], self.data[start + 2]

    def set(self, x, y, color):
        r, g, b = sanitize_color(color)
        start = self.get_index(x, y)
        self.data[start] = r
        self.data[start + 1] = g
        self.data[start + 2] = b

    def save_as(self, filename=None):
        raise NotImplementedError('cs1media in Pythonpad does not support save_as method.')

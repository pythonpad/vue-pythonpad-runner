from .drawable import Drawable

class Shape(Drawable):
    def __init__(self, reference=None):
        Drawable.__init__(self, reference)
        self.borderColor = (0, 0, 0)
        self.borderWidth = 1

    def draw(self):
        d = Drawable.draw(self)
        d['borderColor'] = self.borderColor
        d['borderWidth'] = self.borderWidth
        return d

    def getBorderColor(self):
        return self.borderColor

    def getBorderWidth(self):
        return self.borderWidth

    def setBorderColor(self, color):
        self.borderColor = color
        self.update()

    def setBorderWidth(self, width):
        self.borderWidth = width
        self.update()
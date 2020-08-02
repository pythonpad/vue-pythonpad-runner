from .shape import Shape

class FillableShape(Shape):
    def __init__(self, reference=None):
        Shape.__init__(self, reference)
        self.fillColor = (0, 0, 0, 0)

    def draw(self):
        d = Shape.draw(self)
        d['fillColor'] = self.fillColor
        return d

    def getFillColor(self):
        return self.fillColor

    def setFillColor(self, color):
        self.fillColor = color
        self.update()

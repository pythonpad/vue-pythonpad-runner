from .shape import Shape

class FillableShape(Shape):
    def __init__(self, reference=None):
        Shape.__init__(self, reference)
        self.fillColor = 'transparent'

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.fillColor = self.fillColor
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Shape.draw(self)
        d['fillColor'] = self.fillColor
        return d

    def getFillColor(self):
        return self.fillColor

    def setFillColor(self, color):
        self.fillColor = color
        self.update()

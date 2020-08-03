from .fillable_shape import FillableShape
from .point import Point

class Rectangle(FillableShape):
    def __init__(self, w=20, h=10, centerPt=None):
        if not isinstance(w, (int, float)):
            raise TypeError('width must be numeric')
        if w <= 0:
            raise ValueError('width must be positive')
        if not isinstance(h, (int, float)):
            raise TypeError('height must be numeric')
        if h <= 0:
            raise ValueError('height must be positive')
        if centerPt and not isinstance(centerPt, Point):
            raise TypeError('center must be specified as a Point')

        FillableShape.__init__(self)
        self.width = w
        self.height = h
        self.initx = -w / 2
        self.inity = -h / 2
        if centerPt is not None:
            self.moveTo(centerPt.getX(), centerPt.getY())

    def draw(self):
        d = FillableShape.draw(self)
        d['type'] = 'rectangle'
        d['width'] = self.width
        d['height'] = self.height
        return d

    def getHeight(self):
        return self.height

    def getWidth(self):
        return self.width

    def setHeight(self, h):
        self.inity = -h / 2
        self.height = h
        self.update()

    def setWidth(self, w):
        self.initx = -w / 2
        self.width = w
        self.update()

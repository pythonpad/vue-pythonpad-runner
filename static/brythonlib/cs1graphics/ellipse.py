from .fillable_shape import FillableShape
from .point import Point


class Ellipse(FillableShape):
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
        if centerPt is not None:
            self.moveTo(centerPt.getX(), centerPt.getY())

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.width = self.width
        drawable.height = self.height
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = FillableShape.draw(self)
        d['type'] = 'ellipse'
        d['width'] = self.width
        d['height'] = self.height
        return d

    def getHeight(self):
        return self.height

    def getWidth(self):
        return self.width

    def setHeight(self, h):
        self.height = h
        self.update()

    def setWidth(self, w):
        self.width = w
        self.update()

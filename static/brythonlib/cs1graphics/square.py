from .rectangle import Rectangle
from .point import Point

class Square(Rectangle):
    def __init__(self, size=10, centerPt=None):
        if not isinstance(size, (int, float)):
            raise TypeError('size must be numeric')
        if size <= 0:
            raise ValueError('size must be positive')
        if centerPt and not isinstance(centerPt, Point):
            raise TypeError('center must be specified as a Point')

        Rectangle.__init__(self, size, size, centerPt)

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Rectangle.draw(self)
        d['type'] = 'square'
        return d

    def getSize(self):
        return self.getWidth()

    def setSize(self, s):
        if not isinstance(s, (int, float)):
            raise TypeError('size must be numeric')
        if s <= 0:
            raise ValueError('size must be positive')

        Rectangle.setWidth(self, s)
        Rectangle.setHeight(self, s)
        self.update()

    def setWidth(self, w):
        if not isinstance(w, (int, float)):
            raise TypeError('width must be numeric')
        if w <= 0:
            raise ValueError("width must be positive")
        self.setSize(w)
        self.update()

    def setHeight(self, h):
        if not isinstance(h, (int, float)):
            raise TypeError('height must be numeric')
        if h <= 0:
            raise ValueError("height must be positive")
        self.setSize(h)
        self.update()

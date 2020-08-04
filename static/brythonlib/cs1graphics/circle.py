from .fillable_shape import FillableShape
from .point import Point


class Circle(FillableShape):
    def __init__(self, radius=10, centerPt=None):
        if not isinstance(radius, (int, float)):
            raise TypeError('radius must be numeric')
        if radius <= 0:
            raise ValueError("radius must be positive")
        if centerPt and not isinstance(centerPt, Point):
            raise TypeError("circle's center must be specified as a Point")

        FillableShape.__init__(self)
        self.radius = radius
        if centerPt is not None:
            self.moveTo(centerPt.getX(), centerPt.getY())

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.radius = self.radius
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = FillableShape.draw(self)
        d['type'] = 'circle'
        d['radius'] = self.radius
        return d

    def getRadius(self):
        return self.radius

    def setRadius(self, radius):
        self.radius = radius
        self.update()

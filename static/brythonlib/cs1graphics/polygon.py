from .fillable_shape import FillableShape
from .path import Path
from .point import Point


class Polygon(Path, FillableShape):
    def __init__(self, *points):
        FillableShape.__init__(self)
        try:
            Path.__init__(self, *points)
        except TypeError:
            raise
        self.closePath = True

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.closePath = self.closePath
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Path.draw(self)
        d['type'] = 'polygon'
        d['fillColor'] = self.fillColor
        return d

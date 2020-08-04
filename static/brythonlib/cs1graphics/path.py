from .shape import Shape
from .point import Point


class Path(Shape):
    def __init__(self, *points):
        Shape.__init__(self)

        for p in points:
            if not isinstance(p, Point):
                raise TypeError('non-Point specified as parameter')

        self.points = list(points)
        self.closePath = False
        if len(self.points) >= 1:
            self.adjustReference(self.points[0].getX(), self.points[0].getY())

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.points = self.points.copy()
        drawable.closePath = self.closePath
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Shape.draw(self)
        d['type'] = 'path'
        d['d'] = self.getDirection() if self.points else ''
        return d

    def getDirection(self):
        coords = []
        cmd = 'M'
        for point in self.points:
            coords.append('%s%s %s' % (cmd, point.getX(), point.getY()))
            cmd = 'L'
        if self.closePath:
            coords.append('Z')
        return ' '.join(coords)

    def addPoint(self, point, index=-1):
        if not isinstance(point, Point):
            raise TypeError('parameter must be a Point instance')
        if index > -1:
            self.points.insert(index, point)
        else:
            self.points.append(point)
        if len(self.points) == 1:
            self.refx = point.getX()
            self.refy = point.getY()

    def deletePoint(self, index=-1):
        if not isinstance(index, int):
            raise TypeError('index must be an integer')
        try:
            self.points.pop(index)
        except IndexError:
            raise IndexError('index out of range')
        self.update()

    def clearPoints(self):
        self.points = list()
        self.update()

    def getNumberOfPoints(self):
        return len(self.points)

    def getPoint(self, index):
        if not isinstance(index, int):
            raise TypeError('index must be an integer')
        try:
            p = self.points[index]
        except IndexError:
            raise IndexError('index out of range')
        return Point(p.getX(), p.getY())

    def setPoint(self, point, index=-1):
        if not isinstance(index, int):
            raise TypeError('index must be an integer')
        if not isinstance(point, Point):
            raise TypeError('first parameter must be a Point instance')
        try:
            self.points[index] = point
        except IndexError:
            raise IndexError('index out of range')
        self.update()

    def getPoints(self):
        return list(self.points)

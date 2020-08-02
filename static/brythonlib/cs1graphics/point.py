class Point(object):
    def __init__(self, initialX=0, initialY=0):
        if not isinstance(initialX, (int, float)):
            raise TypeError('x-coordinate must be a number')

        if not isinstance(initialY, (int, float)):
            raise TypeError('y-coordinate must be a number')

        self._x = initialX
        self._y = initialY

    def getX(self):
        return self._x

    def setX(self, val):
        if not isinstance(val, (int, float)):
            raise TypeError('x-coordinate must be a number')
        self._x = val

    def getY(self):
        return self._y

    def setY(self, val):
        if not isinstance(val, (int, float)):
            raise TypeError('y-coordinate must be a number')
        self._y = val

    def get(self):
        return self._x, self._y

    def scale(self, factor):
        if not isinstance(factor, (int, float)):
            raise TypeError('scaling factor must be a number')
        self._x *= factor
        self._y *= factor

    def distance(self, other):
        if not isinstance(other, Point):
            raise TypeError('other must be a Point instance')
        dx = self._x - other._x
        dy = self._y - other._y
        return _math.sqrt(dx * dx + dy * dy)

    def normalize(self):
        mag = self.distance( Point() )
        if mag > 0:
            self.scale(1./mag)

    def __str__(self):
        return '<' + str(self._x) + ',' + str(self._y) + '>'

    def __neg__(self):
        return Point(-self._x, -self._y)

    def __add__(self, other):
        if not isinstance(other, Point):
            raise TypeError('both operands must be Point instances')
        return Point(self._x + other._x, self._y + other._y)

    def __sub__(self, other):
        if not isinstance(other, Point):
            raise TypeError('both operands must be Point instances')
        return Point(self._x - other._x, self._y - other._y)

    def __mul__(self, operand):
        if isinstance(operand, (int, float)):         # multiply by constant
            return Point(self._x * operand, self._y * operand)
        elif isinstance(operand, Point):           # dot-product
            return self._x * operand._x + self._y * operand._y
        else:
            raise TypeError('unexpected operand for multiplication')

    def __rmul__(self, operand):
        return self * operand

    def __xor__(self, angle):
        if not isinstance(angle, (int, float)):
            raise TypeError('angle must be a number')
        angle = _math.pi*angle/180.
        return Point(self._x * _math.cos(angle) - self._y * _math.sin(angle),
                     self._x * _math.sin(angle) + self._y * _math.cos(angle))

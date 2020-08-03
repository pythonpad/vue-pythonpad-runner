from math import pi, sin, cos, sqrt

class Transform(object):
    def __init__(self, a=1, b=0, c=0, d=1, e=0, f=0):
        self.a = a
        self.b = b
        self.c = c 
        self.d = d
        self.e = e
        self.f = f
    
    def __mul__(self, op):
        if isinstance(op, Transform): 
            return Transform(
                self.a * op.a + self.c * op.b, 
                self.b * op.a + self.d * op.b,
                self.a * op.c + self.c * op.d,
                self.b * op.c + self.d * op.d,
                self.a * op.e + self.c * op.f + self.e,
                self.b * op.e + self.d * op.f + self.f
            )
        else:
            raise TypeError('unexpected operand for multiplication')

    def to_list(self):
        return [self.a, self.b, self.c, self.d, self.e, self.f]

    def to_matrix_string(self):
        return 'matrix(%s %s %s %s %s %s)' % (self.a, self.b, self.c, self.d, self.e, self.f)

    @staticmethod
    def translate(tx, ty):
        return Transform(1, 0, 0, 1, tx, ty)

    @staticmethod
    def scale(sx, sy):
        return Transform(sx, 0, 0, sy, 0, 0)

    @staticmethod
    def rotate(rad):
        return Transform(cos(rad), sin(rad), -sin(rad), cos(rad), 0, 0)

    @staticmethod
    def rotateAngle(a):
        return Transform.rotate(a * (pi / 180))

    @staticmethod
    def shear(shear):
        return Transform(1, -shear, 0, 1, 0, 0)
        
    @staticmethod
    def flip():
        return Transform(-1, 0, 0, 1, 0, 0)

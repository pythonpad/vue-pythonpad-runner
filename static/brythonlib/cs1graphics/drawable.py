from .event_trigger import _EventTrigger
from .point import Point
from .transform import Transform
from .store import create_uid

class Drawable(_EventTrigger):
    def __init__(self, reference=None):
        _EventTrigger.__init__(self)
        self.id = create_uid(self)
        if reference is not None:
            self.refx = reference.getX()
            self.refy = reference.getY()
        self.initx = 0
        self.inity = 0
        self.refx = 0
        self.refy = 0
        self.x = 0
        self.y = 0
        self.depth = 50
        self.transform = Transform()
        self.container = None

    def __deepcopy__(self, memo={}):
        drawable = self.__class__.__new__(self.__class__)
        drawable.id = create_uid(drawable)
        drawable.initx = self.initx
        drawable.inity = self.inity
        drawable.refx = self.refx
        drawable.refy = self.refy
        drawable.x = self.x
        drawable.y = self.y
        drawable.depth = self.depth
        drawable.transform = self.transform
        drawable.container = None
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        return {
            'id': self.id,
            'initx': self.initx,
            'inity': self.inity,
            'refx': self.refx,
            'refy': self.refy,
            'x': self.x,
            'y': self.y,
            'depth': self.depth,
            'transform': self.transform.to_matrix_string(),
        }

    def on_add(self, container):
        self.container = container

    def on_remove(self, container):
        self.container = None

    def update(self):
        if self.container:
            self.container.on_edit(self)

    def adjustReference(self, dx, dy):
        self.refx += dx
        self.refy += dy
        self.update()
    
    def clone(self):
        pass

    def setDepth(self, depth):
        self.depth = depth
        self.update()

    def getDepth(self):
        return self.depth

    def getReferencePoint(self):
        return Point(self.x + self.refx, self.y + self.refy)

    def getRefTransform(self):
        return Transform.translate(self.x + self.refx, self.y + self.refy)

    def getInvRefTransform(self):
        return Transform.translate(-self.x - self.refx, -self.y - self.refy)

    def applyTransformWithRef(self, transform):
        self.transform = (
            self.getRefTransform() *
            transform *
            self.getInvRefTransform() *
            self.transform
        )

    def move(self, dx, dy):
        self.x += dx
        self.y += dy
        self.transform = Transform.translate(dx, dy) * self.transform
        self.update()

    def moveTo(self, x, y):
        dx = x - self.x
        dy = y - self.y
        self.x = x
        self.y = y
        self.transform = Transform.translate(dx, dy) * self.transform
        self.update()

    def rotate(self, angle):
        self.applyTransformWithRef(Transform.rotateAngle(angle))
        self.update()

    def scale(self, factor):
        self.applyTransformWithRef(Transform.scale(factor, factor))
        self.update()

    def stretch(self, xFactor, yFactor, angle=0):
        self.applyTransformWithRef(
            Transform.rotateAngle(angle) *
            Transform.scale(xFactor, yFactor) *
            Transform.rotateAngle(-angle)
        )
        self.update()

    def shear(self, shear, angle=0):
        self.applyTransformWithRef(
            Transform.rotateAngle(angle) *
            Transform.shear(shear) *
            Transform.rotateAngle(-angle)
        )
        self.update()

    def flip(self, angle=0):
        self.applyTransformWithRef(
            Transform.rotateAngle(angle) *
            Transform.flip() *
            Transform.rotateAngle(-angle)
        )
        self.update()

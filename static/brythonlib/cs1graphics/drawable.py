from .event_trigger import _EventTrigger
from .store import create_uid

class Drawable(_EventTrigger):
    def __init__(self, reference=None):
        _EventTrigger.__init__(self)
        self.id = create_uid(self)
        if reference is not None:
            self.refx = reference.getX()
            self.refy = reference.getY()
        self.refx = 0
        self.refy = 0
        self.x = 0
        self.y = 0
        self.rotateAngle = 0
        self.scaleFactor = 1
        self.flipAngle = 0
        self.depth = 0
        self.container = None

    def draw(self):
        return {
            'id': self.id,
            'refx': self.refx,
            'refy': self.refy,
            'x': self.x,
            'y': self.y,
            'rotateAngle': self.rotateAngle,
            'scaleFactor': self.scaleFactor,
            'flipAngle': self.flipAngle,
            'depth': self.depth,
        }

    def on_add(self, container):
        self.container = container

    def update(self):
        if self.container:
            self.container.drawer.on_edit(self)

    def adjustReference(self, dx, dy):
        self.refx += dx
        self.refy += dy
        self.update()
    
    def clone(self):
        pass

    def flip(self, angle=0):
        pass

    def getDepth(self):
        return self.depth

    def getReferencePoint(self):
        return Point(refx, refy)

    def move(self, dx, dy):
        self.x += dx
        self.y += dy
        self.update()

    def moveTo(self, x, y):
        self.x = x
        self.y = y
        self.update()

    def rotate(self, angle):
        self.rotateAngle = angle
        self.update()

    def scale(self, factor):
        self.scaleFactor = factor
        self.update()

    def setDepth(self, depth):
        self.depth = depth
        self.update()

    def shear(self, shear, angle=0):
        raise NotImplementedError('This function is not implemented yet.')

    def stretch(self, shear, angle=0):
        raise NotImplementedError('This function is not implemented yet.')

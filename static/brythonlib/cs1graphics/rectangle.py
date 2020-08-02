from .fillable_shape import FillableShape

class Rectangle(FillableShape):
    def __init__(self, w=20, h=10, centerPt=None):
        FillableShape.__init__(self)
        self.width = w
        self.height = h
        if centerPt is not None:
            self.centerx = centerPt.getX()
            self.centery = centerPt.getY()
        else:
            self.centerx = 0
            self.centery = 0

    def draw(self):
        d = FillableShape.draw(self)
        d['type'] = 'rectangle'
        d['width'] = self.width
        d['height'] = self.height
        d['centerx'] = self.centerx
        d['centery'] = self.centery
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

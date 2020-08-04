from .drawable import Drawable
from .point import Point

PT_PIXEL_RATIO = 1.32

class Text(Drawable):
    def __init__(self, message='', fontsize=12, centerPt=None):
        if not isinstance(message, str):
            raise TypeError('message must be a string')
        if not isinstance(fontsize, (int, float)):
            raise TypeError('fontsize must be numeric')
        if fontsize <= 0:
            raise ValueError('fontsize must be positive')
        if centerPt and not isinstance(centerPt, Point):
            raise TypeError('center must be a Point')

        Drawable.__init__(self)
        self.text = message
        self.size = fontsize
        self.color = [0, 0, 0]
        self.initx = -self.getRenderedWidth() / 2
        self.inity = -self.getRenderedHeight() / 2
        if centerPt:
            self.move(centerPt.getX(), centerPt.getY())
    
    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.text = self.text
        drawable.size = self.size
        drawable.color = self.color
        drawable.initx = self.initx
        drawable.inity = self.inity
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Drawable.draw(self)
        d['type'] = 'text'
        d['initx'] = self.initx
        d['inity'] = self.inity
        d['text'] = self.text
        d['size'] = self.size * PT_PIXEL_RATIO
        d['color'] = self.color
        return d

    def getRenderedWidth(self):
        lines = self.text.split('\n')
        maxlen = max([len(line) for line in lines])
        return self.size * PT_PIXEL_RATIO * 0.5 * maxlen

    def getRenderedHeight(self):
        lines = self.text.split('\n')
        return self.size * PT_PIXEL_RATIO * len(lines)

    def getDimensions(self):
        return self.getRenderedWidth(), self.getRenderedHeight()

    def getFontColor(self):
        return self.color

    def getFontSize(self):
        return self.size

    def getMessage(self):
        return self.text

    def setFontColor(self, color):
        self.color = color
        self.update()

    def setFontSize(self, fontsize):
        self.size = fontsize
        self.initx = -self.getRenderedWidth() / 2
        self.inity = -self.getRenderedHeight() / 2
        self.update()

    def setMessage(self, message):
        self.text = message
        self.initx = -self.getRenderedWidth() / 2
        self.inity = -self.getRenderedHeight() / 2
        self.update()

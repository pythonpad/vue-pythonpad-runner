import browser
import os
from .drawable import Drawable
from .point import Point

class Image(Drawable):
    def __init__(self, *args):
        Drawable.__init__(self)

        if not 1 <= len(args) <= 2:
            raise TypeError('must specify a filename')
        elif len(args) == 2:
            raise NotImplementedError('cs1graphics in Pythonpad does not support Image with width and height')
        
        if not isinstance(args[0], str):
            raise TypeError('filename must be a string')

        try:
            self.filename = os.path.normpath(args[0])
        except:
            raise ValueError('filename is not valid')

        if not browser.self.isFileExist(self.filename):
            raise ValueError('unable to load image file: ' + self.filename)

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        drawable.filename = self.filename
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Drawable.draw(self)
        d['type'] = 'image'
        d['filename'] = self.filename
        return d

    def getWidth(self):
        raise NotImplementedError('cs1graphics in Pythonpad does not support getWidth')

    def getHeight(self):
        raise NotImplementedError('cs1graphics in Pythonpad does not support getHeight')
    
    def getPixel(self, x, y):
        raise NotImplementedError('cs1graphics in Pythonpad does not support getPixel')

    def setPixel(self, x, y, color):
        raise NotImplementedError('cs1graphics in Pythonpad does not support setPixel')

    def updatePixels(self):
        raise NotImplementedError('cs1graphics in Pythonpad does not support updatePixels')

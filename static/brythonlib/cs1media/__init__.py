import browser
from .picture import Picture


def create_picture(width, height, color=(0,0,0)):
    if width < 0 or height < 0:
        raise ValueError('Invalid image dimensions: %s, %s' % (width, height))
    return Picture(width, height, color=color)

def load_picture(filename=None):
    if filename is None:
        raise NotImplementedError('Pythonpad\'s cs1media does not support dynamic image file loading.')
    if not browser.self.isFileExist(filename):
        raise FileNotFoundError('No such file: \'%s\'' % filename)
    file_dict = browser.self.getFileDict(filename)
    if 'imageData' not in file_dict:
        raise ValueError('Pre-extracted image data is not found. Be aware that cs1media in Pythonpad only supports loading an image file that already existed in pad\'s virtual file structure when the code is executed, only when cs1media is directly imported in main.py.')
    return Picture(file_dict['width'], file_dict['height'], data=file_dict['imageData'])


__all__ = [
    'create_picture',
    'load_picture',
]
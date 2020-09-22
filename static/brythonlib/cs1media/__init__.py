import browser
from .picture import Picture


def create_picture(width, height, color=(0,0,0)):
    global __media__
    try:
        if ('locked_picture' in __media__) and ('lock_create' in __media__) and __media__['lock_create']:
            return __media__['locked_picture']
    except NameError:
        __media__ = {}

    if width < 0 or height < 0:
        raise ValueError('Invalid image dimensions: %s, %s' % (width, height))
    picture = Picture(width, height, color=color)

    if 'pictures' not in __media__:
        __media__['pictures'] = [picture]
    else:
        __media__['pictures'].append(picture)

    return picture

def load_picture(filename=None):
    global __media__
    try:
        if 'locked_picture' in __media__:
            return __media__['locked_picture']
    except NameError:
        __media__ = {}

    if filename is None:
        raise NotImplementedError('Pythonpad\'s cs1media does not support dynamic image file loading.')
    if not browser.self.isFileExist(filename):
        raise FileNotFoundError('No such file: \'%s\'' % filename)
    file_dict = browser.self.getFileDict(filename)
    if 'imageData' not in file_dict:
        raise ValueError('Pre-extracted image data is not found. Be aware that cs1media in Pythonpad only supports loading an image file that already existed in pad\'s virtual file structure when the code is executed, only when cs1media is directly imported in main.py.')
    picture = Picture(
        file_dict['width'], file_dict['height'], data=file_dict['imageData'])

    if 'pictures' not in __media__:
        __media__['pictures'] = [picture]
    else:
        __media__['pictures'].append(picture)

    return picture

def lock_picture(picture, lock_create=False):
    global __media__
    try:
        __media__['locked_picture'] = picture
    except NameError:
        __media__ = {'locked_picture': picture}
    if lock_create:
        __media__['lock_create'] = True

def unlock_picture():
    global __media__
    try:
        del __media__['locked_picture']
        del __media__['lock_create']
    except:
        pass

def get_all_pictures():
    try:
        if 'pictures' in __media__:
            return __media__['pictures']
        else:
            return []
    except NameError:
        return []


__all__ = [
    'create_picture',
    'load_picture',
    'lock_picture',
    'unlock_picture',
    'get_all_pictures',
]

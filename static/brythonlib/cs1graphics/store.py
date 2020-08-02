__graphics__ = {}
__graphics__['objs'] = {}

def set_canvas(canvas):
    if 'canvas' in __graphics__:
        __graphics__['canvas'].close()
    __graphics__['canvas'] = canvas

def remove_canvas(canvas):
    del __graphics__['canvas']

def create_uid(obj):
    uid = len(__graphics__['objs'])
    __graphics__['objs'][uid] = obj
    return uid
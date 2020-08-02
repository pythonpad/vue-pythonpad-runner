from .event_trigger import _EventTrigger
from .graphics_container import _GraphicsContainer
from .pythonpad_drawer import PythonpadDrawer
from .store import set_canvas, remove_canvas, create_uid

class Canvas(_EventTrigger, _GraphicsContainer):
    def __init__(self, w=200, h=200, bgColor=None, title='Graphics canvas', autoRefresh=True):
        self.drawer = PythonpadDrawer(auto_flush=autoRefresh)
        _EventTrigger.__init__(self)
        _GraphicsContainer.__init__(self, self.drawer)
        self.id = create_uid(self)
        self.width = w
        self.height = h
        self.bgColor = bgColor
        self.title = title
        self.objs = []
        set_canvas(self)
        self.drawer.on_create_canvas(self)

    def draw(self):
        return {
            'type': 'canvas',
            'id': self.id,
            'width': self.width,
            'height': self.height,
            'bgColor': self.bgColor,
            'title': self.title,
        }

    def close(self):
        self.drawer.on_remove_canvas()
        remove_canvas(self)

    def getBackgroundColor(self):
        return self.bgColor

    def getHeight(self):
        return self.height

    def getWidth(self):
        return self.width

    def open(self):
        pass

    def refresh(self, force=False):
        if force:
            objs = self.objs.copy()
            self.clear()
            for obj in objs:
                self.add(obj)
        self.drawer.flush()

    def saveToFile(self, filename):
        raise NotImplementedError('cs1graphics in Pythonpad does not support saveToFile.')

    def setAutoRefresh(self, autoRefresh=True):
        self.drawer.auto_flush = autoRefresh

    def setBackgroundColor(self, color):
        self.bgColor = color
        self.drawer.on_edit_canvas(self)

    def setHeight(self, h):
        self.height = h
        self.drawer.on_edit_canvas(self)

    def setTitle(self, title):
        self.title = title
        self.drawer.on_edit_canvas(self)

    def setWidth(self, w):
        self.width = w
        self.drawer.on_edit_canvas(self)

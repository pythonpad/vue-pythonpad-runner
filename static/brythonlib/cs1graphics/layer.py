from .drawable import Drawable
from .graphics_container import _GraphicsContainer

class Layer(Drawable, _GraphicsContainer):
    def __init__(self):
        Drawable.__init__(self)
        _GraphicsContainer.__init__(self)

    def __deepcopy__(self, memo={}):
        drawable = super().__deepcopy__()
        return drawable

    def clone(self):
        return self.__deepcopy__()

    def draw(self):
        d = Drawable.draw(self)
        d['type'] = 'layer'
        return d

    def set_drawer(self, drawer):
        self.drawer = drawer
        self.drawer.on_add(self.container, self)  # Render myself.
        for obj in self.objs:
            if isinstance(obj, _GraphicsContainer):
                obj.set_drawer(self.container.drawer)
            else:
                self.drawer.on_add(self, obj)

    def on_remove(self, container):
        self.clear()
        self.drawer = None
        Drawable.on_remove(self, container)

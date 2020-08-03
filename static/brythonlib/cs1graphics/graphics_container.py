class _GraphicsContainer(object):
    def __init__(self, drawer=None):
        self.objs = []
        self.drawer = drawer

    def __contains__(self, obj):
        return obj in self.objs

    def init_drawer(self, drawer):
        self.drawer = drawer
        for drawable in self.objs:
            self.drawer.on_add(self, drawable)
            if isinstance(drawable, _GraphicsContainer):
                drawable.init_drawer(self.drawer)

    def on_edit(self, drawable):
        if self.drawer:
            self.drawer.on_edit(drawable)

    def add(self, drawable):
        if drawable not in self:
            self.objs.append(drawable)
            drawable.on_add(self)
            if self.drawer:
                self.drawer.on_add(self, drawable)
                if isinstance(drawable, _GraphicsContainer):
                    drawable.init_drawer(self.drawer)

    def clear(self):
        for obj in self.objs:
            self.remove(obj)

    def getContents(self):
        self.objs.sort(key=lambda x: x.depth)
        return self.objs

    def remove(self, drawable):
        if drawable in self:
            self.objs = [obj for obj in self.objs if obj != drawable]
            drawable.on_remove(self)
            if self.drawer:
                self.drawer.on_remove(self, drawable)

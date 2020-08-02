class _GraphicsContainer(object):
    def __init__(self, drawer):
        self.objs = []
        self.drawer = drawer

    def __contains__(self, obj):
        return obj in self.objs

    def add(self, drawable):
        if drawable not in self:
            self.objs.append(drawable)
            self.drawer.on_add(self, drawable)
            drawable.on_add(self)

    def clear(self):
        for obj in self.objs:
            self.remove(obj)

    def getContents(self):
        self.objs.sort(key=lambda x: x.depth)
        return self.objs

    def remove(self, drawable):
        if drawable in self:
            self.objs = [obj for obj in self.objs if obj != drawable]
            self.drawer.on_remove(self, drawable)
            drawable.on_remove(self)
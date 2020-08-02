class _EventTrigger(object):
    def __init__(self):
        pass

    def raiseEventError(self):
        raise NotImplementedError('cs1graphics in Pythonpad does not support events.')

    def addHandler(self, handler):
        self.raiseEventError()

    def removeHandler(self, handler):
        self.raiseEventError()

    def wait(self):
        self.raiseEventError()

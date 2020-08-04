from .rectangle import Rectangle


class TextBox(Rectangle):
    def __init__(self, *args, **kwargs):
        raise NotImplementedError(
            'TextBox is not supported in Pythonpad\'s cs1graphics.')

import browser
import json
from time import sleep
from .json_drawer import JsonDrawer


class PythonpadDrawer(JsonDrawer):
    def __init__(self, auto_flush=True):
        super().__init__(auto_flush)
        browser.self.sendMsg('screen.cs1graphics.init', '')

    def print(self, s):
        browser.self.sendMsg('screen.cs1graphics.draw', s)

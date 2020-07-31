import browser
import json
from time import sleep
from .json_drawer import JsonDrawer


class PythonpadDrawer(JsonDrawer):
    def __init__(self):
        super().__init__()
        browser.self.sendMsg('screen.cs1robot.init', '')

    def print(self, s):
        browser.self.sendMsg('screen.cs1robot.draw', s)

    def on_pause(self, duration):
        sleep(duration)
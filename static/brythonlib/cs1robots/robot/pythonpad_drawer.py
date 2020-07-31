import json
from time import sleep
from .json_drawer import JsonDrawer


class PythonpadDrawer(JsonDrawer):
    def __init__(self):
        super().__init__()
        # runner.send_message('draw', json.dumps({ 'type': 'robot-init' }))

    def print(self, s):
        print(s)
        # runner.send_message('draw', json.dumps({
        #     'type': 'robot-draw',
        #     'value': s,
        # }))

    def on_pause(self, duration):
        sleep(duration)
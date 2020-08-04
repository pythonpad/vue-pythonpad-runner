from .drawer import Drawer
from time import sleep
import json

class JsonDrawer(Drawer):
    def __init__(self):
        super().__init__()

    def print(self, s):
        print(s)

    def print_dict(self, out_dict):
        self.print(out_dict)
    
    def draw(self, width, height, pieces, walls):
        self.print_dict({
            'task': 'draw_world',
            'width': width,
            'height': height
        })
        for p in pieces.values():
            p_dict = p.to_dict()
            p_dict['task'] = 'draw_piece'
            self.print_dict(p_dict)
        for w in walls:
            w_dict = w.to_dict()
            w_dict['task'] = 'draw_wall'
            self.print_dict(w_dict)

    def on_add(self, piece):
        p_dict = piece.to_dict()
        p_dict['task'] = 'draw_piece'
        self.print_dict(p_dict)

    def on_remove(self, piece):
        p_dict = piece.to_dict()
        p_dict['task'] = 'remove_piece'
        self.print_dict(p_dict)

    def on_move(self, piece):
        p_dict = piece.to_dict()
        p_dict['task'] = 'move_piece'
        self.print_dict(p_dict)

    def on_rotate(self, piece):
        p_dict = piece.to_dict()
        p_dict['task'] = 'rotate_piece'
        self.print_dict(p_dict)

    def on_pause(self, duration):
        self.print_dict({
            'task': 'pause',
            'duration': duration,
        })

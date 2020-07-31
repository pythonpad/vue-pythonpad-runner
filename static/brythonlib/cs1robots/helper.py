from .robot.direction import Direction
from .robot.drawer import Drawer
from .robot.piece import Piece
from .robot.position import Position
from .robot.robot import Robot as GeneralRobot
from .robot.wall import Wall
from .robot.world import World, load_world_from_save
from .worlds_data import get_world_dict
import json

def is_world():
    global __robot__
    try:
        return 'world' in __robot__
    except:
        return False

def create_world(**kwargs):
    global __robot__
    __robot__ = {}
    __robot__['world'] = World(**kwargs)

def load_world(world_name):
    if '/' in world_name:
        world_name = world_name.split('/')[-1]
    if world_name.endswith('.wld'):
        world_name = world_name[:-4]
    load_world_from_dict(get_world_dict(world_name))

def save_world_to_dict():
    return __robot__['world'].to_save()

def load_world_from_dict(world_dict):
    global __robot__
    __robot__ = {}
    __robot__['world'] = load_world_from_save(world_dict)

def get_world():
    return __robot__['world']

def get_all_beepers():
    return get_world().get_all_beepers()

def get_all_beepers_dict():
    return get_world().get_all_beepers_dict()

class Robot(GeneralRobot):
    def __init__(self, row=None, column=None, direction=None, beepers=0):
        global __robot__
        params = {
            'beepers': beepers
        }
        if row is not None and column is not None:
            params['position'] = Position(column, row)
        if direction is not None:
            params['direction'] = Direction(direction)
        super().__init__(**params)
        __robot__['world'].add_piece(self)

__all__ = [
    'create_world',
    'load_world',
    'Robot',
]

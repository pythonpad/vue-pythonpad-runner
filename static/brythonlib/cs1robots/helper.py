from .robot.direction import Direction
from .robot.drawer import Drawer
from .robot.piece import Piece
from .robot.position import Position
from .robot.robot import Robot as GeneralRobot
from .robot.wall import Wall
from .robot.world import World, load_world_from_save
from .worlds_data import conv_world, get_world_dict
import json

def is_world():
    global __robot__
    try:
        return 'world' in __robot__
    except:
        return False

def create_world(streets=None, avenues=None):
    global __robot__
    try:
        if 'world_lock' in __robot__:
            return
    except:
        pass
    width = 10 if avenues is None else avenues
    height = 10 if streets is None else streets
    if avenues is None:
        width = 10
    __robot__ = {}
    __robot__['world'] = World(width=width, height=height)
    if 'robots' in __robot__:
        del __robot__['robots']

def lock_world():
    global __robot__
    try:
        __robot__['world_lock'] = True
    except:
        pass

def unlock_world():
    global __robot__
    try:
        del __robot__['world_lock']
    except:
        pass

def load_world_from_dict(world_dict):
    global __robot__
    __robot__ = {}
    __robot__['world'] = load_world_from_save(world_dict)
    if 'robots' in __robot__:
        del __robot__['robots']

def load_world_by_path(file_path):
    world_file = open(file_path, 'r')
    world_data_source = world_file.read()
    world_file.close()
    global_dict = {}
    exec(world_data_source, global_dict)
    world_dict = conv_world(global_dict)
    load_world_from_dict(world_dict)

def load_world_by_name(world_name):
    load_world_from_dict(get_world_dict(world_name))

def load_world(arg):
    global __robot__
    try:
        if 'world_lock' in __robot__:
            return
    except:
        pass
    try:
        load_world_by_path(arg)
    except FileNotFoundError as e:
        try:
            load_world_by_name(arg)
        except:
            raise e

def save_world_to_dict():
    return __robot__['world'].to_save()

def get_world():
    return __robot__['world']

def get_all_beepers():
    return get_world().get_all_beepers()

def get_all_beepers_dict():
    return get_world().get_all_beepers_dict()

def lock_robot_parameters(avenue=None, street=None, orientation=None, beepers=0):
    global __robot__
    params = {
        'avenue': avenue,
        'street': street,
        'orientation': orientation,
        'beepers': beepers,
    }
    try:
        __robot__['robot_params'] = params
    except NameError:
        __robot__ = {'robot_params': params}

def unlock_robot_parameters():
    global __robot__
    try:
        del __robot__['robot_params']
    except:
        pass

def get_all_robots():
    if 'robots' in __robot__:
        return __robot__['robots']
    else:
        return []

class Robot(GeneralRobot):
    def __init__(self, avenue=None, street=None, orientation=None, beepers=0):
        global __robot__
        params = {
            'avenue': avenue,
            'street': street,
            'orientation': orientation,
            'beepers': beepers,
        }
        try:
            if 'robot_params' in __robot__:
                params = __robot__['robot_params']
        except NameError:
            pass
        row = (params['street'] - 1) if params['street'] is not None else 0
        column = (params['avenue'] - 1) if params['avenue'] is not None else 0
        direction = params['orientation'] if params['orientation'] is not None else 'E'
        beeper_count = params['beepers']
        super().__init__(position=Position(column, row), direction=Direction(direction), beepers=beeper_count)
        __robot__['world'].add_piece(self)
        if 'robots' not in __robot__:
            __robot__['robots'] = [self]
        else:
            __robot__['robots'].append(self)

    def get_pos(self):
        return self.position.x + 1, self.position.y + 1

__all__ = [
    'create_world',
    'load_world',
    'Robot',
]

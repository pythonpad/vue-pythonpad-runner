import sys
import os
sys.path.insert(0, os.path.abspath('..'))
import json
from urobot.helper import *
from urobot import Beeper, World, Wall, Position, JsonDrawer

def turn_right():
    for i in range(3):
        robot.turn_left()


world = World(walls=[Wall(Position(1, 0), Position(2, 0))], drawer=JsonDrawer())
beeper = Beeper()
world.add_piece(beeper)
f = open('temp_world.json', 'w')
f.write(json.dumps(world.to_save()))
f.close()

# create_world(walls=[Wall(Position(1, 0), Position(2, 0))])
load_world('temp_world.json')

robot = Robot(beepers=3)
robot.set_pause(0.5)
robot.set_trace('#222')
robot.move()
robot.drop_beeper()
robot.drop_beeper()
robot.turn_left()
robot.move()
robot.drop_beeper()
turn_right()
robot.move()
turn_right()
robot.move()
robot.turn_left()

for i in range(10):
    robot.move()
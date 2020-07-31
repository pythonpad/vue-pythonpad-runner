from .agent import Agent
from .beeper import Beeper
from .direction import Direction, load_direction_from_save
from .position import Position, load_position_from_save

DEFAULT_PAUSE_DURATION = 0.2

def load_robot_from_save(robot_save):
    return Robot(
        position=load_position_from_save(robot_save['position']),
        direction=load_direction_from_save(robot_save['direction']),
        beepers=robot_save['beepers'],
        pause=robot_save['pause'],
        trace=robot_save['trace']
    )

class RobotException(Exception):
    pass

class Robot(Agent):
    def __init__(self, position=None, direction=None, beepers=0, pause=None, trace=None):
        super().__init__(position=position, direction=direction, trace=trace)
        self.pause_duration = DEFAULT_PAUSE_DURATION if pause is None else pause
        self.beepers = []
        self.position_log = [self.position.to_list()]
        for _ in range(beepers):
            self.beepers.append(Beeper())
        self.agent_type = 'robot'

    def _is_adjacent_position_clear(self, position):
        is_front_in_world = self.world.is_in_world(position)
        is_no_wall_front = not self.world.is_wall_between(self.position, position)
        return is_front_in_world and is_no_wall_front

    def to_save(self):
        return {
            'type': 'robot',
            'piece_type': 'agent',
            'position': self.position.to_save(),
            'direction': self.direction.to_save(),
            'beepers': len(self.beepers),
            'pause': self.pause_duration,
            'trace': self.trace_color
        }

    def set_pause(self, duration):
        self.pause_duration = duration

    def move(self):
        after_position = self.position + self.direction.get_delta()
        if not self.world.is_in_world(after_position):
            raise RobotException('Cannot move! I cannot go out of the world!')
        if self.world.is_wall_between(self.position, after_position):
            raise RobotException('Cannot move! There is a wall in front of me!')
        self.position = after_position
        self.position_log.append(self.position.to_list())
        if self.world:
            self.world.on_move(self)
            self.world.on_pause(self.pause_duration)

    def turn_left(self):
        self.direction = self.direction.get_next()
        if self.world:
            self.world.on_rotate(self)
            self.world.on_pause(self.pause_duration)

    def front_is_clear(self):
        return self._is_adjacent_position_clear(self.position + self.direction.get_delta())

    def left_is_clear(self):
        return self._is_adjacent_position_clear(self.position + self.direction.get_next().get_delta())

    def right_is_clear(self):
        return self._is_adjacent_position_clear(self.position + self.direction.get_prev().get_delta())

    def facing_north(self):
        return self.direction == Direction('north')

    def carries_beepers(self):
        return bool(self.beepers)

    def on_beeper(self):
        return self.world.is_beeper(self.position)

    def pick_beeper(self):
        beeper = self.world.get_beeper(self.position)
        if beeper is None:
            raise RobotException('There is no beeper to pick up!')
        self.world.remove_piece(beeper)
        self.beepers.append(beeper)

    def drop_beeper(self):
        if not self.beepers:
            raise RobotException('I have no beeper to drop!')
        beeper = self.beepers.pop()
        beeper.set_position(self.position.clone())
        self.world.add_piece(beeper)

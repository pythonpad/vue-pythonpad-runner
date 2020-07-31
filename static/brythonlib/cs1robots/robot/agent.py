from .position import Position, load_position_from_save
from .direction import Direction, load_direction_from_save
from .piece import Piece

def load_agent_from_save(agent_save):
    from .robot import load_robot_from_save
    if agent_save['type'] == 'robot':
        return load_robot_from_save(agent_save)
    else:
        return Agent(
            position=load_position_from_save(agent_save['position']),
            direction=load_direction_from_save(agent_save['direction']),
            trace=agent_save['trace']
        )

class Agent(Piece):
    def __init__(self, position=None, direction=None, trace=None):
        super().__init__(position=position);
        self.direction = Direction('e') if direction is None else direction
        self.piece_type = 'agent'
        self.agent_type = 'marker'
        self.trace_color = trace

    def set_trace(self, color='blue'):
        self.trace_color = color

    def to_dict(self): 
        agent_dict = super().to_dict().copy()
        agent_dict['agent_type'] = self.agent_type
        agent_dict['trace_color'] = self.trace_color
        agent_dict['direction'] = self.direction.to_char()
        return agent_dict

    def to_save(self):
        return {
            'type': 'agent',
            'piece_type': 'agent',
            'position': self.position.to_save(),
            'direction': self.direction.to_save(),
            'trace': self.trace_color
        }

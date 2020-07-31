from .position import Position

def load_direction_from_save(direction_save):
    return Direction(direction_save['direction'])

class Direction(object):
    def __init__(self, direction):
        self.direction = direction.lower()[0]
        if self.direction not in 'wsen':
            raise Exception('Unknown direction')

    def __str__(self):
        direction_dict = {
            'w': 'West',
            'e': 'East',
            'n': 'North',
            's': 'South'
        }
        return direction_dict[self.direction]

    def __eq__(self, other):
        return self.direction == other.direction
    
    def __ne__(self, other):
        return not self == other

    def to_char(self):
        return self.direction

    def to_save(self):
        return { 
            'type': 'direction', 
            'direction': self.direction 
        }

    def get_delta(self):
        if self.direction == 'w':
            return Position(-1, 0)
        elif self.direction == 'e':
            return Position(1, 0)
        elif self.direction == 'n':
            return Position(0, 1)
        elif self.direction == 's':
            return Position(0, -1)

    def get_next(self):
        directions = 'wsen'
        return Direction(directions[(directions.index(self.direction) + 1) % 4])

    def get_prev(self):
        directions = 'wsen'
        return Direction(directions[(directions.index(self.direction) - 1) % 4])
            

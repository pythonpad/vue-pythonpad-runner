from .position import load_position_from_save

def load_wall_from_save(wall_save):
    return Wall(
        load_position_from_save(wall_save['position_1']),
        load_position_from_save(wall_save['position_2'])
    )

class Wall(object):
    def __init__(self, position_1, position_2):
        self.position_1 = position_1
        self.position_2 = position_2

    def __str__(self):
        return 'wall(%s,%s)' % (self.position_1.to_list(), self.position_2.to_list())

    def __eq__(self, other):
        self_positions = [self.position_1.to_list(), self.position_2.to_list()]
        other_positions = [other.position_1.to_list(), other.position_2.to_list()]
        self_positions.sort()
        other_positions.sort()
        return self_positions == other_positions

    def __ne__(self, other):
        return not self == other

    def to_dict(self):
        return {
            'x1': self.position_1.x,
            'y1': self.position_1.y,
            'x2': self.position_2.x,
            'y2': self.position_2.y
        }

    def to_save(self):
        return {
            'type': 'wall',
            'position_1': self.position_1.to_save(),
            'position_2': self.position_2.to_save()
        }

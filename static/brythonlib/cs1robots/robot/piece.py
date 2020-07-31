from .position import Position, load_position_from_save
from .direction import Direction

def load_piece_from_save(piece_save):
    from .marker import load_marker_from_save
    from .agent import load_agent_from_save
    if piece_save['piece_type'] == 'marker':
        piece = load_marker_from_save(piece_save)
    elif piece_save['piece_type'] == 'agent':
        piece = load_agent_from_save(piece_save)
    else:
        piece = Piece(position=load_position_from_save(piece_save['position']))
    if 'id' in piece_save:
        piece.id = piece_save['id']
    return piece

class Piece(object):
    def __init__(self, position=None):
        self.id = None
        self.world = None
        self.piece_type = 'piece'
        self.position = Position(0, 0) if position is None else position

    def to_dict(self): 
        return {
            'id': self.id,
            'piece_type': self.piece_type,
            'x': self.position.x,
            'y': self.position.y
        }

    def to_save(self):
        return {
            'type': 'piece',
            'position': self.position.to_save()
        }

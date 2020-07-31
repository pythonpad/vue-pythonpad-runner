from .marker import Marker
from .direction import Direction
from .position import Position, load_position_from_save

def load_beeper_from_save(beeper_save):
    return Beeper(
        position=load_position_from_save(beeper_save['position'])
    )

class Beeper(Marker):
    def __init__(self, position=None):
        super().__init__(position)
        self.marker_type = 'beeper'
        
    def to_save(self):
        return {
            'type': 'beeper',
            'piece_type': 'marker',
            'position': self.position.to_save()
        }
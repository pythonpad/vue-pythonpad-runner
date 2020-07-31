from .piece import Piece

def load_marker_from_save(marker_save):
    from .beeper import load_beeper_from_save
    if marker_save['type'] == 'beeper':
        return load_beeper_from_save(marker_save)
    else:
        return Marker(
            position=load_position_from_save(marker_save['position'])
        )

class Marker(Piece):
    def __init__(self, position=None):
        super().__init__(position=position)
        self.piece_type = 'marker'
        self.marker_type = 'marker'

    def to_dict(self): 
        marker_dict = super().to_dict().copy()
        marker_dict['marker_type'] = self.marker_type
        return marker_dict

    def to_save(self):
        return {
          'type': 'marker',
          'piece_type': 'marker',
          'position': self.position.to_save()
        }

    def set_position(self, position):
        self.position = position
        if self.world:
            self.world.on_move(self)

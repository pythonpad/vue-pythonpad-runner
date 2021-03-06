def conv_world(kaist_world_dict):
    pieces = {}
    for (sx, sy), count in kaist_world_dict['beepers'].items():
        for i in range(count):
            beeper_id = len(pieces)
            pieces[beeper_id] = {
                'type': 'beeper', 
                'piece_type': 'marker', 
                'id': beeper_id,
                'position': {
                    'type': 'position', 
                    'x': sx - 1, 
                    'y': sy - 1,
                },
            }
    walls = []
    for sx, sy in kaist_world_dict['walls']:
        x1, y1 = (sx - 1) // 2, (sy - 1) // 2
        if sx % 2 == 0:
            x2 = x1 + 1
            y2 = y1
        else:
            x2 = x1
            y2 = y1 + 1
        walls.append({
           'type': 'wall',
           'position_1': {
               'type': 'position',
               'x': x1,
               'y': y1,
           },
           'position_2': {
               'type': 'position',
               'x': x2,
               'y': y2,
           },
        })

    return {
        'type': 'world',
        'width': kaist_world_dict['avenues'],
        'height': kaist_world_dict['streets'],
        'pieces': pieces,
        'walls': walls
    }

def get_world_dict(title):
    global worlds_data
    if title not in worlds_data:
        raise ValueError('Unknown world name: "%s"' % title)
    return conv_world(worlds_data[title])

worlds_data = {
    'around': {'avenues': 10, 'streets': 10, 'walls': [], 'beepers': {(1, 9): 1, (2, 10): 1, (8, 10): 1, (10, 10): 1, (9, 10): 1, (5, 10): 1, (10, 8): 1, (10, 4): 1, (10, 1): 1, (8, 1): 1, (7, 1): 1, (6, 1): 1, (5, 1): 1, (3, 1): 1, (1, 6): 1, (1, 5): 1, (1, 3): 1}},
    'around2': {'avenues': 10, 'streets': 10, 'walls': [], 'beepers': {(2, 1): 2, (3, 1): 3, (5, 1): 2, (7, 1): 1, (10, 1): 1, (10, 4): 3, (10, 3): 1, (10, 7): 2, (10, 6): 1, (10, 10): 4, (10, 9): 3, (9, 10): 1, (7, 10): 2, (5, 10): 1, (4, 10): 1, (3, 10): 1, (2, 10): 1, (1, 10): 2, (1, 8): 1, (1, 6): 4, (1, 5): 1, (1, 3): 3, (1, 2): 1}},
    'around3': {'avenues': 6, 'streets': 6, 'walls': [], 'beepers': {(2, 1): 2, (3, 1): 1, (6, 1): 1, (6, 2): 3, (6, 3): 1, (6, 6): 2, (4, 6): 3, (1, 6): 1, (1, 4): 2, (1, 3): 1, (1, 2): 1}},
    'cave': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (4, 1), (5, 4), (2, 5), (3, 6), (5, 6), (6, 3), (6, 1), (8, 1), (8, 3), (9, 4), (10, 3), (11, 2), (1, 8), (3, 8), (5, 8), (7, 8), (8, 7), (14, 1), (14, 3), (13, 4), (11, 6), (12, 7), (13, 8), (14, 7), (14, 5), (9, 8)], 'beepers': {(6, 5): 1}},
    'cave2': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (4, 1), (4, 3), (4, 5), (3, 6), (1, 8), (3, 8), (5, 8), (6, 7), (7, 8), (9, 8), (10, 7), (9, 6), (8, 5), (8, 1), (10, 1), (10, 3), (7, 4), (6, 3)], 'beepers': {(6, 3): 1}},
    'cave3': {'avenues': 10, 'streets': 10, 'walls': [(2, 1), (1, 4), (5, 2), (6, 1), (3, 4), (5, 6), (3, 6), (2, 5), (6, 3), (7, 6), (8, 5), (8, 1), (9, 2), (12, 1), (12, 3), (12, 5), (9, 4), (12, 7), (11, 8), (11, 6), (9, 8), (7, 8), (5, 8), (3, 8)], 'beepers': {(1, 5): 4, (2, 2): 2, (3, 3): 3, (4, 2): 1, (6, 2): 1, (5, 4): 1, (1, 4): 3}},
    'cave4': {'avenues': 10, 'streets': 10, 'walls': [(2, 1), (1, 4), (3, 2), (5, 2), (3, 4), (5, 6), (6, 5), (7, 4), (8, 3), (8, 1), (2, 5), (1, 8), (3, 8), (5, 8), (7, 8), (9, 8), (9, 6), (10, 5), (11, 8), (12, 7), (12, 5), (11, 4), (12, 1), (10, 3)], 'beepers': {(3, 2): 1, (2, 4): 3, (4, 4): 3, (7, 2): 4}},
    'chimney': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (2, 5), (2, 7), (2, 9), (2, 11), (4, 11), (4, 9), (4, 7), (4, 5), (4, 3), (3, 12), (5, 2), (6, 3), (6, 5), (7, 6), (8, 5), (8, 3), (9, 2), (11, 2), (12, 3), (12, 5), (12, 7), (12, 9), (13, 10), (14, 9), (14, 7), (14, 5), (14, 3), (15, 2), (16, 3), (16, 5), (16, 7), (16, 9), (16, 11), (16, 13), (16, 15), (17, 16), (18, 15), (18, 13), (18, 11), (18, 9), (18, 7), (18, 5), (18, 3), (19, 2)], 'beepers': {(2, 6): 1, (2, 5): 1, (2, 4): 2, (2, 2): 1, (9, 7): 1, (9, 5): 2, (9, 4): 3, (4, 3): 5, (7, 2): 1, (7, 4): 3, (7, 3): 1, (7, 5): 1}},
    'chimney2': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (2, 5), (2, 7), (3, 8), (4, 7), (4, 5), (4, 3), (4, 9), (4, 11), (4, 13), (4, 15), (5, 16), (6, 15), (6, 13), (6, 11), (6, 9), (6, 7), (6, 5), (6, 3), (7, 2), (8, 3), (10, 3), (11, 2), (13, 2), (14, 3), (16, 3), (18, 3), (17, 2), (18, 5), (18, 7), (18, 9), (18, 11), (18, 13), (18, 15), (19, 16), (15, 4), (8, 5), (10, 5), (10, 11), (9, 12), (8, 11), (8, 9), (10, 9), (10, 7), (8, 7)], 'beepers': {(3, 8): 2, (8, 2): 3, (2, 3): 2, (2, 4): 1, (3, 3): 3, (3, 2): 2, (3, 5): 3, (3, 6): 1, (5, 2): 2, (5, 6): 1, (10, 7): 2}},
    'chimney3': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (2, 5), (2, 7), (3, 8), (4, 7), (4, 5), (4, 3), (4, 9), (4, 11), (5, 12), (6, 11), (6, 9), (6, 7), (6, 5), (6, 3), (7, 2), (9, 2), (10, 3), (10, 5), (10, 7), (11, 8), (12, 9), (12, 11), (13, 12), (14, 11), (14, 9), (15, 8), (16, 9), (16, 11), (16, 15), (16, 13), (16, 17), (18, 17), (18, 15), (18, 13), (18, 11), (18, 9), (19, 8), (13, 2), (15, 2), (17, 2), (19, 2), (13, 4), (15, 4), (17, 4), (19, 4), (13, 6), (15, 6), (17, 6), (19, 6), (17, 18)], 'beepers': {(3, 2): 1, (2, 3): 3, (2, 4): 2, (3, 4): 6, (3, 5): 1, (7, 6): 5, (7, 5): 1, (9, 5): 3, (9, 7): 2}},
    'mine': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2)], 'beepers': {(2, 1): 1, (3, 1): 1, (5, 1): 1, (8, 1): 1, (10, 1): 1}},
    'mine2':{'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2)], 'beepers': {(2, 1): 2, (3, 1): 2, (6, 1): 3, (5, 1): 1, (8, 1): 1, (10, 1): 4}},
    'mine3': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2)], 'beepers': {(10, 1): 5, (9, 1): 1, (8, 1): 3, (6, 1): 2, (1, 1): 2, (2, 1): 1, (3, 1): 3}},
    'mine4': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 2), (6, 3), (7, 4), (8, 1), (9, 2), (11, 2), (12, 1), (9, 4), (11, 4), (13, 4), (14, 3), (15, 2), (17, 2), (19, 2)], 'beepers': {(10, 1): 2, (8, 1): 3, (7, 2): 1, (7, 1): 1, (4, 2): 6, (5, 2): 1, (4, 1): 1, (3, 1): 2}},
    'mine5': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 2), (6, 3), (9, 2), (8, 1), (10, 1), (7, 4), (9, 4), (11, 4), (12, 3), (13, 2), (14, 3), (14, 5), (14, 7), (15, 8), (17, 8), (19, 8), (17, 6), (16, 5), (18, 5), (19, 4), (16, 3), (16, 1)], 'beepers': {(10, 3): 1, (2, 1): 2, (4, 1): 3, (5, 2): 2, (7, 1): 3, (8, 2): 4, (8, 3): 1, (8, 4): 2}},
    'stairs': {'avenues': 10, 'streets': 10, 'walls': [(2, 1), (3, 2), (4, 3), (5, 4), (6, 5), (7, 6), (8, 7), (9, 8), (10, 9), (11, 10), (12, 11), (13, 12), (14, 13), (15, 14), (16, 15), (17, 16), (18, 17), (19, 18)], 'beepers': {(10, 10): 1}},
    'stairs2': {'avenues': 10, 'streets': 10, 'walls': [(2, 1), (3, 2), (5, 2), (6, 3), (7, 4), (8, 5), (9, 6), (11, 6), (12, 7), (13, 8), (14, 9), (15, 10), (17, 10), (18, 11), (19, 12)], 'beepers': {(10, 7): 1}},
    'stairs3': {'avenues': 10, 'streets': 10, 'walls': [(4, 1), (5, 2), (6, 3), (7, 4), (9, 4), (11, 4), (12, 5), (13, 6), (14, 7), (15, 8), (17, 8), (18, 9), (19, 10)], 'beepers': {(10, 6): 1}},
    'stairs4': {'avenues': 10, 'streets': 10, 'walls': [(2, 1), (3, 2), (4, 3), (5, 4), (7, 4), (9, 4), (11, 4), (12, 5), (13, 6), (15, 6), (16, 7), (17, 8), (18, 9), (19, 10)], 'beepers': {(4, 3): 1}},
    'coins': {'avenues': 10, 'streets': 10, 'walls': [(3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2), (2, 3), (2, 5), (2, 7), (2, 9), (2, 11), (2, 13), (2, 15), (2, 17), (2, 19)], 'beepers': {(2, 1): 1, (4, 1): 3, (5, 1): 2, (8, 1): 3, (7, 1): 6, (1, 2): 3, (1, 10): 1, (1, 8): 3, (1, 9): 1, (1, 4): 1}},
    'coins2': {'avenues': 10, 'streets': 10, 'walls': [(2, 19), (2, 17), (2, 15), (2, 13), (2, 11), (2, 9), (2, 7), (2, 5), (2, 3), (3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2)], 'beepers': {(6, 1): 1, (7, 1): 1, (5, 1): 2, (10, 1): 3, (2, 1): 1, (1, 2): 3, (1, 3): 2, (1, 6): 4, (1, 10): 7}},
    'news': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (4, 3), (5, 4), (6, 3), (7, 2), (8, 3), (9, 4), (10, 3), (11, 2), (13, 2), (14, 3), (15, 4), (16, 3), (17, 2), (19, 2)], 'beepers': {}},
    'news2': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (2, 3), (3, 4), (4, 3), (5, 2), (6, 3), (7, 4), (8, 3), (9, 2), (10, 3), (11, 4), (12, 3), (15, 2), (17, 2), (13, 2), (18, 3), (19, 4)], 'beepers': {}},
    'news3': {'avenues': 10, 'streets': 10, 'walls': [(1, 2), (3, 2), (5, 4), (4, 3), (6, 3), (7, 4), (8, 3), (9, 4), (10, 3), (11, 4), (12, 3), (13, 2), (14, 3), (15, 4), (16, 3), (17, 4), (18, 3), (19, 2)], 'beepers': {}},
    'read': {'avenues': 10, 'streets': 10, 'walls': [], 'beepers': {(10, 1): 7}},
    'read2': {'avenues': 10, 'streets': 10, 'walls': [], 'beepers': {(9, 1): 2, (10, 1): 4, (8, 1): 3}},
    'read3': {'avenues': 10, 'streets': 10, 'walls': [], 'beepers': {(6, 1): 2, (8, 1): 3, (9, 1): 1, (10, 1): 7}},
    'hurdles1': {
        'avenues': 10,
        'streets': 10,
        'walls': [(4, 1), (8, 1), (12, 1), (16, 1)],
        'beepers': {(10, 1): 1},
    },
    'hurdles2': {
        'avenues': 10,
        'streets': 10,
        'walls': [(4, 1), (8, 1), (12, 1), (16, 1)],
        'beepers': {(7, 1): 1},
    },
    'hurdles3': {
        'avenues': 10,
        'streets': 10,
        'walls': [(4, 1), (8, 1), (16, 1), (2, 1), (10, 1), (18, 1), (12, 1)],
        'beepers': {(10, 1): 1},
    },
    'beepers1': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(3, 1): 1},
    },
    'corner3_4': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {},
    },
    'rain1': {
        'avenues': 10,
        'streets': 10,
        'walls': [(5, 6), (4, 7), (4, 9), (4, 13), (4, 15), (5, 16), (9, 16), (13, 16), (15, 16), (16, 15), (16, 11), (16, 9), (16, 7), (15, 6), (11, 6), (7, 6)],
        'beepers': {},
    },
    'newspaper': {
        'avenues': 10,
        'streets': 10,
        'walls': [(4, 1), (5, 2), (7, 2), (8, 3), (9, 4), (11, 4), (12, 5), (13, 6), (15, 6), (16, 7), (17, 8), (19, 8)],
        'beepers': {},
    },
    'hurdles4': {
        'avenues': 10,
        'streets': 10,
        'walls': [(4, 1), (8, 1), (16, 1), (2, 1), (10, 1), (18, 1), (12, 1), (4, 3), (10, 3), (10, 5)],
        'beepers': {(10, 1): 1},
    },
    'frank18': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(7, 4): 1, (3, 7): 2, (7, 1): 19, (6, 6): 2, (3, 4): 2},
    },
    'rain2': {
        'avenues': 12,
        'streets': 9,
        'walls': [(5, 6), (7, 6), (11, 6), (13, 6), (15, 6), (16, 5), (17, 4), (21, 4), (22, 5), (22, 9), (22, 11), (22, 15), (21, 16), (19, 16), (15, 16), (13, 16), (9, 16), (5, 16), (4, 15), (4, 13), (4, 9), (4, 7)],
        'beepers': {},
    },
    'wrong': {
        'avenues': 10,
        'streets': 10,
        'walls': [10, (10, 3), (10, 5), (1, 10), (3, 10), (5, 10), (2, 1), (2, 3), (1, 6), (3, 6), (4, 5), (4, 3), (5, 2), (6, 3), (7, 8), (5, 8), (2, 7), (7, 10), (8, 7), (9, 6), (8, 3), (9, 4), (9, 10), (10, 9)],
        'beepers': {(6, 4): 1},
    },
    'hanoi3': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(2, 1): 3, (2, 2): 2, (2, 3): 1},
    },
    'fairy_tale': {
        'avenues': 14,
        'streets': 8,
        'walls': [(1, 10), (3, 10), (4, 9), (5, 8), (6, 7), (9, 8), (11, 8), (12, 7), (12, 5), (12, 3), (12, 1)],
        'beepers': {},
    },
    'hanoi4': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(2, 4): 1, (2, 1): 4, (2, 2): 3, (2, 3): 2},
    },
    'empty': {
        'avenues': 8,
        'streets': 8,
        'walls': [],
        'beepers': {},
    },
    'trash1': {
        'avenues': 10,
        'streets': 10,
        'walls': [(3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2), (1, 4), (2, 3)],
        'beepers': {(6, 1): 1, (3, 1): 3, (5, 1): 1, (10, 1): 2, (7, 1): 2},
    },
    'trash2': {
        'avenues': 10,
        'streets': 10,
        'walls': [(3, 2), (5, 2), (7, 2), (9, 2), (11, 2), (13, 2), (15, 2), (17, 2), (19, 2), (1, 4), (2, 3)],
        'beepers': {(9, 1): 1, (5, 1): 13, (2, 1): 2, (7, 1): 2},
    },
    'trash3': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(1, 2): 18, (7, 3): 4, (4, 8): 1, (5, 6): 7, (7, 1): 4, (9, 2): 11, (8, 8): 1, (1, 10): 3, (2, 5): 3, (5, 8): 2, (7, 9): 2},
    },
    'trash4': {
        'avenues': 11,
        'streets': 10,
        'walls': [],
        'beepers': {(6, 9): 3, (1, 3): 2, (9, 8): 2, (10, 6): 1, (5, 1): 2, (1, 11): 2, (10, 3): 1, (5, 5): 2, (2, 9): 1, (6, 10): 2, (1, 5): 1, (2, 2): 1, (8, 6): 2, (4, 10): 1, (8, 2): 1, (8, 11): 2, (9, 10): 3, (4, 11): 1, (2, 7): 1, (4, 6): 1, (9, 2): 1, (3, 4): 3, (5, 7): 1, (3, 8): 3, (7, 8): 5},
    },
    'amazing3a': {
        'avenues': 7,
        'streets': 7,
        'walls': [(2, 1), (3, 2), (5, 2), (6, 3), (6, 5), (6, 7), (6, 9), (6, 11), (6, 13)],
        'beepers': {(1, 2): 1, (2, 7): 1, (3, 2): 1, (1, 3): 1, (3, 3): 1, (1, 7): 1, (1, 4): 1, (2, 4): 1, (1, 5): 1, (2, 6): 1, (1, 6): 1, (3, 6): 1, (2, 2): 1, (2, 3): 1, (3, 7): 1, (2, 5): 1, (3, 4): 1, (1, 1): 1, (3, 5): 1},
    },
    'yardwork': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(1, 2): 18, (7, 3): 4, (4, 8): 1, (5, 6): 7, (7, 1): 4, (9, 2): 11, (8, 8): 1, (1, 10): 3, (2, 5): 3, (5, 8): 2, (7, 9): 2},
    },
    'sort1': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(1, 2): 1, (1, 3): 1, (2, 2): 1, (1, 4): 1, (2, 4): 1, (1, 5): 1, (1, 6): 1, (2, 1): 1, (1, 7): 1, (2, 3): 1, (2, 5): 1, (1, 1): 1},
    },
    'harvest4': {
        'avenues': 7,
        'streets': 7,
        'walls': [],
        'beepers': {(7, 3): 1, (6, 6): 1, (5, 6): 1, (3, 2): 1, (2, 1): 1, (6, 2): 1, (5, 1): 2, (2, 5): 1, (7, 2): 1, (5, 5): 1, (7, 6): 1, (4, 4): 1, (3, 6): 1, (2, 2): 2, (3, 5): 1, (4, 1): 1, (6, 4): 1, (5, 4): 1, (7, 1): 1, (4, 5): 1, (2, 3): 1, (4, 2): 1, (6, 5): 2, (5, 3): 2, (4, 6): 1, (6, 1): 1, (7, 4): 1, (4, 3): 1, (3, 4): 2, (2, 4): 1},
    },
    'amazing5': {
        'avenues': 7,
        'streets': 7,
        'walls': [(3, 2), (6, 5), (6, 7), (6, 9), (6, 11), (6, 13), (4, 1), (2, 3), (3, 4), (5, 4)],
        'beepers': {},
    },
    'maze1': {
        'avenues': 10,
        'streets': 10,
        'walls': [(10, 1), (10, 3), (10, 5), (1, 10), (3, 10), (5, 10), (2, 1), (2, 3), (1, 6), (3, 6), (4, 5), (4, 3), (5, 2), (6, 3), (7, 8), (5, 8), (2, 7), (7, 10), (8, 7), (9, 6), (8, 3), (9, 4), (9, 10), (10, 9)],
        'beepers': {(6, 4): 1},
    },
    'harvest1': {
        'avenues': 7,
        'streets': 7,
        'walls': [],
        'beepers': {(3, 3): 1, (3, 2): 1, (3, 1): 1, (5, 6): 1, (5, 1): 1, (3, 6): 1, (5, 3): 1, (5, 2): 1, (7, 6): 1, (7, 5): 1, (7, 4): 1, (7, 3): 1, (7, 2): 1, (7, 1): 1, (3, 5): 1, (3, 4): 1, (2, 4): 1, (2, 5): 1, (2, 6): 1, (2, 1): 1, (2, 2): 1, (2, 3): 1, (4, 6): 1, (4, 4): 1, (4, 5): 1, (4, 2): 1, (4, 3): 1, (4, 1): 1, (6, 1): 1, (6, 2): 1, (6, 3): 1, (6, 4): 1, (6, 5): 1, (6, 6): 1, (5, 5): 1, (5, 4): 1},
    },
    'amazing1': {
        'avenues': 5,
        'streets': 5,
        'walls': [],
        'beepers': {},
    },
    'harvest2': {
        'avenues': 12,
        'streets': 12,
        'walls': [],
        'beepers': {(7, 3): 1, (6, 10): 1, (6, 6): 1, (2, 8): 1, (10, 6): 1, (7, 7): 1, (4, 6): 1, (6, 2): 1, (7, 11): 1, (3, 7): 1, (10, 8): 1, (5, 5): 1, (4, 4): 1, (8, 10): 1, (4, 8): 1, (8, 6): 1, (5, 3): 1, (9, 7): 1, (4, 10): 1, (2, 6): 1, (5, 11): 1, (5, 9): 1, (7, 5): 1, (6, 12): 1, (6, 4): 1, (3, 5): 1, (11, 7): 1, (6, 8): 1, (5, 7): 1, (9, 9): 1, (8, 8): 1, (7, 9): 1, (1, 7): 1, (9, 5): 1, (3, 9): 1, (8, 4): 1},
    },
    'amazing3': {
        'avenues': 7,
        'streets': 7,
        'walls': [(2, 1), (3, 2), (5, 2), (6, 3), (6, 5), (6, 7), (6, 9), (6, 11), (6, 13)],
        'beepers': {},
    },
    'amazing2': {
        'avenues': 7,
        'streets': 7,
        'walls': [(6, 13), (6, 11), (6, 9), (13, 6), (11, 6), (9, 6), (7, 6), (6, 7)],
        'beepers': {},
    },
    'harvest3': {
        'avenues': 7,
        'streets': 7,
        'walls': [],
        'beepers': {(7, 3): 1, (6, 6): 1, (5, 6): 1, (3, 2): 1, (2, 1): 1, (6, 2): 1, (5, 1): 1, (2, 5): 1, (7, 2): 1, (7, 6): 1, (4, 4): 1, (3, 6): 1, (2, 2): 1, (3, 5): 1, (4, 1): 1, (6, 4): 1, (5, 4): 1, (7, 1): 1, (4, 5): 1, (5, 5): 1, (2, 3): 1, (4, 2): 1, (6, 5): 1, (5, 3): 1, (4, 6): 1, (3, 4): 1, (6, 1): 1, (7, 4): 1, (4, 3): 1, (2, 4): 1},
    },
    'add1': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(10, 1): 3, (10, 2): 2}
    },
    'add2': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(9, 2): 1, (9, 1): 2, (10, 1): 2, (10, 2): 3}
    },
    'add34': {
        'avenues': 10,
        'streets': 10,
        'walls': [],
        'beepers': {(8, 2): 9, (7, 1): 1, (8, 1): 3, (9, 2): 8, (10, 1): 4, (10, 2): 7}
    },
}

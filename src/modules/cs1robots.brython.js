__BRYTHON__.use_VFS = true;
var scripts = {"$timestamp": 1600323794055, "cs1robots.worlds_data": [".py", "def conv_world(kaist_world_dict):\n pieces={}\n for (sx,sy),count in kaist_world_dict['beepers'].items():\n  for i in range(count):\n   beeper_id=len(pieces)\n   pieces[beeper_id]={\n   'type':'beeper',\n   'piece_type':'marker',\n   'id':beeper_id,\n   'position':{\n   'type':'position',\n   'x':sx -1,\n   'y':sy -1,\n   },\n   }\n walls=[]\n for sx,sy in kaist_world_dict['walls']:\n  x1,y1=(sx -1)//2,(sy -1)//2\n  if sx %2 ==0:\n   x2=x1+1\n   y2=y1\n  else :\n   x2=x1\n   y2=y1+1\n  walls.append({\n  'type':'wall',\n  'position_1':{\n  'type':'position',\n  'x':x1,\n  'y':y1,\n  },\n  'position_2':{\n  'type':'position',\n  'x':x2,\n  'y':y2,\n  },\n  })\n  \n return {\n 'type':'world',\n 'width':kaist_world_dict['avenues'],\n 'height':kaist_world_dict['streets'],\n 'pieces':pieces,\n 'walls':walls\n }\n \ndef get_world_dict(title):\n global worlds_data\n if title not in worlds_data:\n  raise ValueError('Unknown world name: \"%s\"'%title)\n return conv_world(worlds_data[title])\n \nworlds_data={\n'around':{'avenues':10,'streets':10,'walls':[],'beepers':{(1,9):1,(2,10):1,(8,10):1,(10,10):1,(9,10):1,(5,10):1,(10,8):1,(10,4):1,(10,1):1,(8,1):1,(7,1):1,(6,1):1,(5,1):1,(3,1):1,(1,6):1,(1,5):1,(1,3):1}},\n'around2':{'avenues':10,'streets':10,'walls':[],'beepers':{(2,1):2,(3,1):3,(5,1):2,(7,1):1,(10,1):1,(10,4):3,(10,3):1,(10,7):2,(10,6):1,(10,10):4,(10,9):3,(9,10):1,(7,10):2,(5,10):1,(4,10):1,(3,10):1,(2,10):1,(1,10):2,(1,8):1,(1,6):4,(1,5):1,(1,3):3,(1,2):1}},\n'around3':{'avenues':6,'streets':6,'walls':[],'beepers':{(2,1):2,(3,1):1,(6,1):1,(6,2):3,(6,3):1,(6,6):2,(4,6):3,(1,6):1,(1,4):2,(1,3):1,(1,2):1}},\n'cave':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(4,1),(5,4),(2,5),(3,6),(5,6),(6,3),(6,1),(8,1),(8,3),(9,4),(10,3),(11,2),(1,8),(3,8),(5,8),(7,8),(8,7),(14,1),(14,3),(13,4),(11,6),(12,7),(13,8),(14,7),(14,5),(9,8)],'beepers':{(6,5):1}},\n'cave2':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(4,1),(4,3),(4,5),(3,6),(1,8),(3,8),(5,8),(6,7),(7,8),(9,8),(10,7),(9,6),(8,5),(8,1),(10,1),(10,3),(7,4),(6,3)],'beepers':{(6,3):1}},\n'cave3':{'avenues':10,'streets':10,'walls':[(2,1),(1,4),(5,2),(6,1),(3,4),(5,6),(3,6),(2,5),(6,3),(7,6),(8,5),(8,1),(9,2),(12,1),(12,3),(12,5),(9,4),(12,7),(11,8),(11,6),(9,8),(7,8),(5,8),(3,8)],'beepers':{(1,5):4,(2,2):2,(3,3):3,(4,2):1,(6,2):1,(5,4):1,(1,4):3}},\n'cave4':{'avenues':10,'streets':10,'walls':[(2,1),(1,4),(3,2),(5,2),(3,4),(5,6),(6,5),(7,4),(8,3),(8,1),(2,5),(1,8),(3,8),(5,8),(7,8),(9,8),(9,6),(10,5),(11,8),(12,7),(12,5),(11,4),(12,1),(10,3)],'beepers':{(3,2):1,(2,4):3,(4,4):3,(7,2):4}},\n'chimney':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(2,5),(2,7),(2,9),(2,11),(4,11),(4,9),(4,7),(4,5),(4,3),(3,12),(5,2),(6,3),(6,5),(7,6),(8,5),(8,3),(9,2),(11,2),(12,3),(12,5),(12,7),(12,9),(13,10),(14,9),(14,7),(14,5),(14,3),(15,2),(16,3),(16,5),(16,7),(16,9),(16,11),(16,13),(16,15),(17,16),(18,15),(18,13),(18,11),(18,9),(18,7),(18,5),(18,3),(19,2)],'beepers':{(2,6):1,(2,5):1,(2,4):2,(2,2):1,(9,7):1,(9,5):2,(9,4):3,(4,3):5,(7,2):1,(7,4):3,(7,3):1,(7,5):1}},\n'chimney2':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(2,5),(2,7),(3,8),(4,7),(4,5),(4,3),(4,9),(4,11),(4,13),(4,15),(5,16),(6,15),(6,13),(6,11),(6,9),(6,7),(6,5),(6,3),(7,2),(8,3),(10,3),(11,2),(13,2),(14,3),(16,3),(18,3),(17,2),(18,5),(18,7),(18,9),(18,11),(18,13),(18,15),(19,16),(15,4),(8,5),(10,5),(10,11),(9,12),(8,11),(8,9),(10,9),(10,7),(8,7)],'beepers':{(3,8):2,(8,2):3,(2,3):2,(2,4):1,(3,3):3,(3,2):2,(3,5):3,(3,6):1,(5,2):2,(5,6):1,(10,7):2}},\n'chimney3':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(2,5),(2,7),(3,8),(4,7),(4,5),(4,3),(4,9),(4,11),(5,12),(6,11),(6,9),(6,7),(6,5),(6,3),(7,2),(9,2),(10,3),(10,5),(10,7),(11,8),(12,9),(12,11),(13,12),(14,11),(14,9),(15,8),(16,9),(16,11),(16,15),(16,13),(16,17),(18,17),(18,15),(18,13),(18,11),(18,9),(19,8),(13,2),(15,2),(17,2),(19,2),(13,4),(15,4),(17,4),(19,4),(13,6),(15,6),(17,6),(19,6),(17,18)],'beepers':{(3,2):1,(2,3):3,(2,4):2,(3,4):6,(3,5):1,(7,6):5,(7,5):1,(9,5):3,(9,7):2}},\n'mine':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2)],'beepers':{(2,1):1,(3,1):1,(5,1):1,(8,1):1,(10,1):1}},\n'mine2':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2)],'beepers':{(2,1):2,(3,1):2,(6,1):3,(5,1):1,(8,1):1,(10,1):4}},\n'mine3':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2)],'beepers':{(10,1):5,(9,1):1,(8,1):3,(6,1):2,(1,1):2,(2,1):1,(3,1):3}},\n'mine4':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,2),(6,3),(7,4),(8,1),(9,2),(11,2),(12,1),(9,4),(11,4),(13,4),(14,3),(15,2),(17,2),(19,2)],'beepers':{(10,1):2,(8,1):3,(7,2):1,(7,1):1,(4,2):6,(5,2):1,(4,1):1,(3,1):2}},\n'mine5':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,2),(6,3),(9,2),(8,1),(10,1),(7,4),(9,4),(11,4),(12,3),(13,2),(14,3),(14,5),(14,7),(15,8),(17,8),(19,8),(17,6),(16,5),(18,5),(19,4),(16,3),(16,1)],'beepers':{(10,3):1,(2,1):2,(4,1):3,(5,2):2,(7,1):3,(8,2):4,(8,3):1,(8,4):2}},\n'stairs':{'avenues':10,'streets':10,'walls':[(2,1),(3,2),(4,3),(5,4),(6,5),(7,6),(8,7),(9,8),(10,9),(11,10),(12,11),(13,12),(14,13),(15,14),(16,15),(17,16),(18,17),(19,18)],'beepers':{(10,10):1}},\n'stairs2':{'avenues':10,'streets':10,'walls':[(2,1),(3,2),(5,2),(6,3),(7,4),(8,5),(9,6),(11,6),(12,7),(13,8),(14,9),(15,10),(17,10),(18,11),(19,12)],'beepers':{(10,7):1}},\n'stairs3':{'avenues':10,'streets':10,'walls':[(4,1),(5,2),(6,3),(7,4),(9,4),(11,4),(12,5),(13,6),(14,7),(15,8),(17,8),(18,9),(19,10)],'beepers':{(10,6):1}},\n'stairs4':{'avenues':10,'streets':10,'walls':[(2,1),(3,2),(4,3),(5,4),(7,4),(9,4),(11,4),(12,5),(13,6),(15,6),(16,7),(17,8),(18,9),(19,10)],'beepers':{(4,3):1}},\n'coins':{'avenues':10,'streets':10,'walls':[(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2),(2,3),(2,5),(2,7),(2,9),(2,11),(2,13),(2,15),(2,17),(2,19)],'beepers':{(2,1):1,(4,1):3,(5,1):2,(8,1):3,(7,1):6,(1,2):3,(1,10):1,(1,8):3,(1,9):1,(1,4):1}},\n'coins2':{'avenues':10,'streets':10,'walls':[(2,19),(2,17),(2,15),(2,13),(2,11),(2,9),(2,7),(2,5),(2,3),(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2)],'beepers':{(6,1):1,(7,1):1,(5,1):2,(10,1):3,(2,1):1,(1,2):3,(1,3):2,(1,6):4,(1,10):7}},\n'news':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(4,3),(5,4),(6,3),(7,2),(8,3),(9,4),(10,3),(11,2),(13,2),(14,3),(15,4),(16,3),(17,2),(19,2)],'beepers':{}},\n'news2':{'avenues':10,'streets':10,'walls':[(1,2),(2,3),(3,4),(4,3),(5,2),(6,3),(7,4),(8,3),(9,2),(10,3),(11,4),(12,3),(15,2),(17,2),(13,2),(18,3),(19,4)],'beepers':{}},\n'news3':{'avenues':10,'streets':10,'walls':[(1,2),(3,2),(5,4),(4,3),(6,3),(7,4),(8,3),(9,4),(10,3),(11,4),(12,3),(13,2),(14,3),(15,4),(16,3),(17,4),(18,3),(19,2)],'beepers':{}},\n'read':{'avenues':10,'streets':10,'walls':[],'beepers':{(10,1):7}},\n'read2':{'avenues':10,'streets':10,'walls':[],'beepers':{(9,1):2,(10,1):4,(8,1):3}},\n'read3':{'avenues':10,'streets':10,'walls':[],'beepers':{(6,1):2,(8,1):3,(9,1):1,(10,1):7}},\n'hurdles1':{\n'avenues':10,\n'streets':10,\n'walls':[(4,1),(8,1),(12,1),(16,1)],\n'beepers':{(10,1):1},\n},\n'hurdles2':{\n'avenues':10,\n'streets':10,\n'walls':[(4,1),(8,1),(12,1),(16,1)],\n'beepers':{(7,1):1},\n},\n'hurdles3':{\n'avenues':10,\n'streets':10,\n'walls':[(4,1),(8,1),(16,1),(2,1),(10,1),(18,1),(12,1)],\n'beepers':{(10,1):1},\n},\n'beepers1':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(3,1):1},\n},\n'corner3_4':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{},\n},\n'rain1':{\n'avenues':10,\n'streets':10,\n'walls':[(5,6),(4,7),(4,9),(4,13),(4,15),(5,16),(9,16),(13,16),(15,16),(16,15),(16,11),(16,9),(16,7),(15,6),(11,6),(7,6)],\n'beepers':{},\n},\n'newspaper':{\n'avenues':10,\n'streets':10,\n'walls':[(4,1),(5,2),(7,2),(8,3),(9,4),(11,4),(12,5),(13,6),(15,6),(16,7),(17,8),(19,8)],\n'beepers':{},\n},\n'hurdles4':{\n'avenues':10,\n'streets':10,\n'walls':[(4,1),(8,1),(16,1),(2,1),(10,1),(18,1),(12,1),(4,3),(10,3),(10,5)],\n'beepers':{(10,1):1},\n},\n'frank18':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(7,4):1,(3,7):2,(7,1):19,(6,6):2,(3,4):2},\n},\n'rain2':{\n'avenues':12,\n'streets':9,\n'walls':[(5,6),(7,6),(11,6),(13,6),(15,6),(16,5),(17,4),(21,4),(22,5),(22,9),(22,11),(22,15),(21,16),(19,16),(15,16),(13,16),(9,16),(5,16),(4,15),(4,13),(4,9),(4,7)],\n'beepers':{},\n},\n'wrong':{\n'avenues':10,\n'streets':10,\n'walls':[10,(10,3),(10,5),(1,10),(3,10),(5,10),(2,1),(2,3),(1,6),(3,6),(4,5),(4,3),(5,2),(6,3),(7,8),(5,8),(2,7),(7,10),(8,7),(9,6),(8,3),(9,4),(9,10),(10,9)],\n'beepers':{(6,4):1},\n},\n'hanoi3':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(2,1):3,(2,2):2,(2,3):1},\n},\n'fairy_tale':{\n'avenues':14,\n'streets':8,\n'walls':[(1,10),(3,10),(4,9),(5,8),(6,7),(9,8),(11,8),(12,7),(12,5),(12,3),(12,1)],\n'beepers':{},\n},\n'hanoi4':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(2,4):1,(2,1):4,(2,2):3,(2,3):2},\n},\n'empty':{\n'avenues':8,\n'streets':8,\n'walls':[],\n'beepers':{},\n},\n'trash1':{\n'avenues':10,\n'streets':10,\n'walls':[(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2),(1,4),(2,3)],\n'beepers':{(6,1):1,(3,1):3,(5,1):1,(10,1):2,(7,1):2},\n},\n'trash2':{\n'avenues':10,\n'streets':10,\n'walls':[(3,2),(5,2),(7,2),(9,2),(11,2),(13,2),(15,2),(17,2),(19,2),(1,4),(2,3)],\n'beepers':{(9,1):1,(5,1):13,(2,1):2,(7,1):2},\n},\n'trash3':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(1,2):18,(7,3):4,(4,8):1,(5,6):7,(7,1):4,(9,2):11,(8,8):1,(1,10):3,(2,5):3,(5,8):2,(7,9):2},\n},\n'trash4':{\n'avenues':11,\n'streets':10,\n'walls':[],\n'beepers':{(6,9):3,(1,3):2,(9,8):2,(10,6):1,(5,1):2,(1,11):2,(10,3):1,(5,5):2,(2,9):1,(6,10):2,(1,5):1,(2,2):1,(8,6):2,(4,10):1,(8,2):1,(8,11):2,(9,10):3,(4,11):1,(2,7):1,(4,6):1,(9,2):1,(3,4):3,(5,7):1,(3,8):3,(7,8):5},\n},\n'amazing3a':{\n'avenues':7,\n'streets':7,\n'walls':[(2,1),(3,2),(5,2),(6,3),(6,5),(6,7),(6,9),(6,11),(6,13)],\n'beepers':{(1,2):1,(2,7):1,(3,2):1,(1,3):1,(3,3):1,(1,7):1,(1,4):1,(2,4):1,(1,5):1,(2,6):1,(1,6):1,(3,6):1,(2,2):1,(2,3):1,(3,7):1,(2,5):1,(3,4):1,(1,1):1,(3,5):1},\n},\n'yardwork':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(1,2):18,(7,3):4,(4,8):1,(5,6):7,(7,1):4,(9,2):11,(8,8):1,(1,10):3,(2,5):3,(5,8):2,(7,9):2},\n},\n'sort1':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(1,2):1,(1,3):1,(2,2):1,(1,4):1,(2,4):1,(1,5):1,(1,6):1,(2,1):1,(1,7):1,(2,3):1,(2,5):1,(1,1):1},\n},\n'harvest4':{\n'avenues':7,\n'streets':7,\n'walls':[],\n'beepers':{(7,3):1,(6,6):1,(5,6):1,(3,2):1,(2,1):1,(6,2):1,(5,1):2,(2,5):1,(7,2):1,(5,5):1,(7,6):1,(4,4):1,(3,6):1,(2,2):2,(3,5):1,(4,1):1,(6,4):1,(5,4):1,(7,1):1,(4,5):1,(2,3):1,(4,2):1,(6,5):2,(5,3):2,(4,6):1,(6,1):1,(7,4):1,(4,3):1,(3,4):2,(2,4):1},\n},\n'amazing5':{\n'avenues':7,\n'streets':7,\n'walls':[(3,2),(6,5),(6,7),(6,9),(6,11),(6,13),(4,1),(2,3),(3,4),(5,4)],\n'beepers':{},\n},\n'maze1':{\n'avenues':10,\n'streets':10,\n'walls':[(10,1),(10,3),(10,5),(1,10),(3,10),(5,10),(2,1),(2,3),(1,6),(3,6),(4,5),(4,3),(5,2),(6,3),(7,8),(5,8),(2,7),(7,10),(8,7),(9,6),(8,3),(9,4),(9,10),(10,9)],\n'beepers':{(6,4):1},\n},\n'harvest1':{\n'avenues':7,\n'streets':7,\n'walls':[],\n'beepers':{(3,3):1,(3,2):1,(3,1):1,(5,6):1,(5,1):1,(3,6):1,(5,3):1,(5,2):1,(7,6):1,(7,5):1,(7,4):1,(7,3):1,(7,2):1,(7,1):1,(3,5):1,(3,4):1,(2,4):1,(2,5):1,(2,6):1,(2,1):1,(2,2):1,(2,3):1,(4,6):1,(4,4):1,(4,5):1,(4,2):1,(4,3):1,(4,1):1,(6,1):1,(6,2):1,(6,3):1,(6,4):1,(6,5):1,(6,6):1,(5,5):1,(5,4):1},\n},\n'amazing1':{\n'avenues':5,\n'streets':5,\n'walls':[],\n'beepers':{},\n},\n'harvest2':{\n'avenues':12,\n'streets':12,\n'walls':[],\n'beepers':{(7,3):1,(6,10):1,(6,6):1,(2,8):1,(10,6):1,(7,7):1,(4,6):1,(6,2):1,(7,11):1,(3,7):1,(10,8):1,(5,5):1,(4,4):1,(8,10):1,(4,8):1,(8,6):1,(5,3):1,(9,7):1,(4,10):1,(2,6):1,(5,11):1,(5,9):1,(7,5):1,(6,12):1,(6,4):1,(3,5):1,(11,7):1,(6,8):1,(5,7):1,(9,9):1,(8,8):1,(7,9):1,(1,7):1,(9,5):1,(3,9):1,(8,4):1},\n},\n'amazing3':{\n'avenues':7,\n'streets':7,\n'walls':[(2,1),(3,2),(5,2),(6,3),(6,5),(6,7),(6,9),(6,11),(6,13)],\n'beepers':{},\n},\n'amazing2':{\n'avenues':7,\n'streets':7,\n'walls':[(6,13),(6,11),(6,9),(13,6),(11,6),(9,6),(7,6),(6,7)],\n'beepers':{},\n},\n'harvest3':{\n'avenues':7,\n'streets':7,\n'walls':[],\n'beepers':{(7,3):1,(6,6):1,(5,6):1,(3,2):1,(2,1):1,(6,2):1,(5,1):1,(2,5):1,(7,2):1,(7,6):1,(4,4):1,(3,6):1,(2,2):1,(3,5):1,(4,1):1,(6,4):1,(5,4):1,(7,1):1,(4,5):1,(5,5):1,(2,3):1,(4,2):1,(6,5):1,(5,3):1,(4,6):1,(3,4):1,(6,1):1,(7,4):1,(4,3):1,(2,4):1},\n},\n'add1':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(10,1):3,(10,2):2}\n},\n'add2':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(9,2):1,(9,1):2,(10,1):2,(10,2):3}\n},\n'add34':{\n'avenues':10,\n'streets':10,\n'walls':[],\n'beepers':{(8,2):9,(7,1):1,(8,1):3,(9,2):8,(10,1):4,(10,2):7}\n},\n}\n", []], "cs1robots": [".py", "from .helper import create_world,load_world,lock_world,Robot\n\n__all__=[\n'create_world',\n'load_world',\n'lock_world',\n'Robot',\n]\n", ["cs1robots.helper"], 1], "cs1robots.helper": [".py", "from .robot.direction import Direction\nfrom .robot.drawer import Drawer\nfrom .robot.piece import Piece\nfrom .robot.position import Position\nfrom .robot.robot import Robot as GeneralRobot\nfrom .robot.wall import Wall\nfrom .robot.world import World,load_world_from_save\nfrom .worlds_data import conv_world,get_world_dict\nimport json\n\ndef is_world():\n global __robot__\n try :\n  return 'world'in __robot__\n except :\n  return False\n  \ndef create_world(streets=None ,avenues=None ):\n global __robot__\n try :\n  if 'world_lock'in __robot__:\n   return\n except :\n  pass\n width=10 if avenues is None else avenues\n height=10 if streets is None else streets\n if avenues is None :\n  width=10\n __robot__={}\n __robot__['world']=World(width=width,height=height)\n if 'robots'in __robot__:\n  del __robot__['robots']\n  \ndef lock_world():\n global __robot__\n try :\n  __robot__['world_lock']=True\n except :\n  pass\n  \ndef unlock_world():\n global __robot__\n try :\n  del __robot__['world_lock']\n except :\n  pass\n  \ndef load_world_from_dict(world_dict):\n global __robot__\n __robot__={}\n __robot__['world']=load_world_from_save(world_dict)\n if 'robots'in __robot__:\n  del __robot__['robots']\n  \ndef load_world_by_path(file_path):\n world_file=open(file_path,'r')\n world_data_source=world_file.read()\n world_file.close()\n global_dict={}\n exec(world_data_source,global_dict)\n world_dict=conv_world(global_dict)\n load_world_from_dict(world_dict)\n \ndef load_world_by_name(world_name):\n load_world_from_dict(get_world_dict(world_name))\n \ndef load_world(arg):\n global __robot__\n try :\n  if 'world_lock'in __robot__:\n   return\n except :\n  pass\n try :\n  load_world_by_path(arg)\n except FileNotFoundError as e:\n  try :\n   load_world_by_name(arg)\n  except :\n   raise e\n   \ndef save_world_to_dict():\n return __robot__['world'].to_save()\n \ndef get_world():\n return __robot__['world']\n \ndef get_all_beepers():\n return get_world().get_all_beepers()\n \ndef get_all_beepers_dict():\n return get_world().get_all_beepers_dict()\n \ndef lock_robot_parameters(avenue=None ,street=None ,orientation=None ,beepers=0):\n global __robot__\n params={\n 'avenue':avenue,\n 'street':street,\n 'orientation':orientation,\n 'beepers':beepers,\n }\n try :\n  __robot__['robot_params']=params\n except NameError:\n  __robot__={'robot_params':params}\n  \ndef unlock_robot_parameters():\n global __robot__\n try :\n  del __robot__['robot_params']\n except :\n  pass\n  \ndef get_all_robots():\n if 'robots'in __robot__:\n  return __robot__['robots']\n else :\n  return []\n  \nclass Robot(GeneralRobot):\n def __init__(self,avenue=None ,street=None ,orientation=None ,beepers=0):\n  global __robot__\n  params={\n  'avenue':avenue,\n  'street':street,\n  'orientation':orientation,\n  'beepers':beepers,\n  }\n  try :\n   if 'robot_params'in __robot__:\n    params=__robot__['robot_params']\n  except NameError:\n   pass\n  row=(params['street']-1)if params['street']is not None else 0\n  column=(params['avenue']-1)if params['avenue']is not None else 0\n  direction=params['orientation']if params['orientation']is not None else 'E'\n  beeper_count=params['beepers']\n  super().__init__(position=Position(column,row),direction=Direction(direction),beepers=beeper_count)\n  __robot__['world'].add_piece(self)\n  if 'robots'not in __robot__:\n   __robot__['robots']=[self]\n  else :\n   __robot__['robots'].append(self)\n   \n def get_pos(self):\n  return self.position.x+1,self.position.y+1\n  \n__all__=[\n'create_world',\n'load_world',\n'Robot',\n]\n", ["cs1robots.robot.direction", "cs1robots.robot.drawer", "cs1robots.robot.piece", "cs1robots.robot.position", "cs1robots.robot.robot", "cs1robots.robot.wall", "cs1robots.robot.world", "cs1robots.worlds_data", "json"]], "cs1robots.robot.pythonpad_drawer": [".py", "import browser\nimport json\nfrom time import sleep\nfrom .json_drawer import JsonDrawer\n\n\nclass PythonpadDrawer(JsonDrawer):\n def __init__(self):\n  super().__init__()\n  browser.self.sendMsg('screen.cs1robot.init','')\n  \n def print(self,s):\n  browser.self.sendMsg('screen.cs1robot.draw',s)\n  \n def on_pause(self,duration):\n  sleep(duration)\n", ["browser", "cs1robots.robot.json_drawer", "json", "time"]], "cs1robots.robot.world": [".py", "from .beeper import Beeper\nfrom .pythonpad_drawer import PythonpadDrawer\nfrom .piece import load_piece_from_save\nfrom .wall import Wall,load_wall_from_save\n\n\ndef load_world_from_save(world_save,drawer=None ):\n return World(\n width=world_save['width'],\n height=world_save['height'],\n pieces={k:load_piece_from_save(p)for k,p in world_save['pieces'].items()},\n walls=[load_wall_from_save(w)for w in world_save['walls']],\n drawer=drawer\n )\n \nclass World(object):\n def __init__(self,width=10,height=10,pieces=None ,walls=None ,drawer=None ):\n  self.width=width\n  self.height=height\n  self.pieces={}if pieces is None else pieces\n  self.walls=[]if walls is None else walls\n  self.drawer=PythonpadDrawer()if drawer is None else drawer\n  self.drawer.set_world(self)\n  self.drawer.draw(width,height,self.pieces,self.walls)\n  \n def to_save(self):\n  return {\n  'type':'world',\n  'width':self.width,\n  'height':self.height,\n  'pieces':{k:p.to_save()for k,p in self.pieces.items()},\n  'walls':[w.to_save()for w in self.walls]\n  }\n  \n def add_piece(self,piece):\n  piece.id=len(self.pieces)\n  piece.world=self\n  self.pieces[piece.id]=piece\n  self.drawer.on_add(piece)\n  \n def remove_piece(self,piece):\n  self.drawer.on_remove(piece)\n  del self.pieces[piece.id]\n  piece.id=None\n  piece.world=None\n  \n def is_in_world(self,position):\n  return 0 <=position.x <self.width and 0 <=position.y <self.height\n  \n def is_wall_between(self,position_1,position_2):\n  wall=Wall(position_1,position_2)\n  return wall in self.walls\n  \n def is_beeper(self,position):\n  return self.get_beeper(position)is not None\n  \n def get_beeper(self,position):\n  for piece_id,piece in self.pieces.items():\n   if isinstance(piece,Beeper)and piece.position ==position:\n    return piece\n  return None\n  \n def get_all_beepers(self):\n  beepers=[]\n  for piece_id,piece in self.pieces.items():\n   if isinstance(piece,Beeper):\n    beepers.append(piece)\n  return beepers\n  \n def get_all_beepers_dict(self):\n  beepers=self.get_all_beepers()\n  beepers_dict={}\n  for beeper in beepers:\n   x,y=beeper.position.to_list()\n   k='%d,%d'%(x,y)\n   if k not in beepers_dict:\n    beepers_dict[k]=1\n   else :\n    beepers_dict[k]+=1\n  return beepers_dict\n  \n def on_move(self,piece):\n  self.drawer.on_move(piece)\n  \n def on_rotate(self,piece):\n  self.drawer.on_rotate(piece)\n  \n def on_pause(self,duration):\n  if duration >0:\n   self.drawer.on_pause(duration)\n", ["cs1robots.robot.beeper", "cs1robots.robot.piece", "cs1robots.robot.pythonpad_drawer", "cs1robots.robot.wall"]], "cs1robots.robot.drawer": [".py", "class Drawer(object):\n def __init__(self):\n  pass\n  \n def set_world(self,world):\n  self.world=world\n  \n def draw(self,width,height,pieces,walls):\n  raise NotImplementedError('draw method is not implemented.')\n  \n def on_add(self,piece):\n  raise NotImplementedError('on_add method is not implemented.')\n  \n def on_remove(self,piece):\n  raise NotImplementedError('on_remove method is not implemented.')\n  \n def on_move(self,piece_id,after_position):\n  raise NotImplementedError('on_move method is not implemented.')\n  \n def on_rotate(self,piece_id,after_direction):\n  raise NotImplementedError('on_rotate method is not implemented.')\n  \n def on_pause(self,duration):\n  raise NotImplementedError('on_pause method is not implemented.')\n", []], "cs1robots.robot.direction": [".py", "from .position import Position\n\ndef load_direction_from_save(direction_save):\n return Direction(direction_save['direction'])\n \nclass Direction(object):\n def __init__(self,direction):\n  self.direction=direction.lower()[0]\n  if self.direction not in 'wsen':\n   raise Exception('Unknown direction')\n   \n def __str__(self):\n  direction_dict={\n  'w':'West',\n  'e':'East',\n  'n':'North',\n  's':'South'\n  }\n  return direction_dict[self.direction]\n  \n def __eq__(self,other):\n  return self.direction ==other.direction\n  \n def __ne__(self,other):\n  return not self ==other\n  \n def to_char(self):\n  return self.direction\n  \n def to_save(self):\n  return {\n  'type':'direction',\n  'direction':self.direction\n  }\n  \n def get_delta(self):\n  if self.direction =='w':\n   return Position(-1,0)\n  elif self.direction =='e':\n   return Position(1,0)\n  elif self.direction =='n':\n   return Position(0,1)\n  elif self.direction =='s':\n   return Position(0,-1)\n   \n def get_next(self):\n  directions='wsen'\n  return Direction(directions[(directions.index(self.direction)+1)%4])\n  \n def get_prev(self):\n  directions='wsen'\n  return Direction(directions[(directions.index(self.direction)-1)%4])\n  \n", ["cs1robots.robot.position"]], "cs1robots.robot.json_drawer": [".py", "from .drawer import Drawer\nfrom time import sleep\nimport json\n\nclass JsonDrawer(Drawer):\n def __init__(self):\n  super().__init__()\n  \n def print(self,s):\n  print(s)\n  \n def print_dict(self,out_dict):\n  self.print(out_dict)\n  \n def draw(self,width,height,pieces,walls):\n  self.print_dict({\n  'task':'draw_world',\n  'width':width,\n  'height':height\n  })\n  for p in pieces.values():\n   p_dict=p.to_dict()\n   p_dict['task']='draw_piece'\n   self.print_dict(p_dict)\n  for w in walls:\n   w_dict=w.to_dict()\n   w_dict['task']='draw_wall'\n   self.print_dict(w_dict)\n   \n def on_add(self,piece):\n  p_dict=piece.to_dict()\n  p_dict['task']='draw_piece'\n  self.print_dict(p_dict)\n  \n def on_remove(self,piece):\n  p_dict=piece.to_dict()\n  p_dict['task']='remove_piece'\n  self.print_dict(p_dict)\n  \n def on_move(self,piece):\n  p_dict=piece.to_dict()\n  p_dict['task']='move_piece'\n  self.print_dict(p_dict)\n  \n def on_rotate(self,piece):\n  p_dict=piece.to_dict()\n  p_dict['task']='rotate_piece'\n  self.print_dict(p_dict)\n  \n def on_pause(self,duration):\n  self.print_dict({\n  'task':'pause',\n  'duration':duration,\n  })\n", ["cs1robots.robot.drawer", "json", "time"]], "cs1robots.robot.wall": [".py", "from .position import load_position_from_save\n\ndef load_wall_from_save(wall_save):\n return Wall(\n load_position_from_save(wall_save['position_1']),\n load_position_from_save(wall_save['position_2'])\n )\n \nclass Wall(object):\n def __init__(self,position_1,position_2):\n  self.position_1=position_1\n  self.position_2=position_2\n  \n def __str__(self):\n  return 'wall(%s,%s)'%(self.position_1.to_list(),self.position_2.to_list())\n  \n def __eq__(self,other):\n  self_positions=[self.position_1.to_list(),self.position_2.to_list()]\n  other_positions=[other.position_1.to_list(),other.position_2.to_list()]\n  self_positions.sort()\n  other_positions.sort()\n  return self_positions ==other_positions\n  \n def __ne__(self,other):\n  return not self ==other\n  \n def to_dict(self):\n  return {\n  'x1':self.position_1.x,\n  'y1':self.position_1.y,\n  'x2':self.position_2.x,\n  'y2':self.position_2.y\n  }\n  \n def to_save(self):\n  return {\n  'type':'wall',\n  'position_1':self.position_1.to_save(),\n  'position_2':self.position_2.to_save()\n  }\n", ["cs1robots.robot.position"]], "cs1robots.robot": [".py", "", [], 1], "cs1robots.robot.beeper": [".py", "from .marker import Marker\nfrom .direction import Direction\nfrom .position import Position,load_position_from_save\n\ndef load_beeper_from_save(beeper_save):\n return Beeper(\n position=load_position_from_save(beeper_save['position'])\n )\n \nclass Beeper(Marker):\n def __init__(self,position=None ):\n  super().__init__(position)\n  self.marker_type='beeper'\n  \n def to_save(self):\n  return {\n  'type':'beeper',\n  'piece_type':'marker',\n  'position':self.position.to_save()\n  }\n", ["cs1robots.robot.direction", "cs1robots.robot.marker", "cs1robots.robot.position"]], "cs1robots.robot.marker": [".py", "from .piece import Piece\n\ndef load_marker_from_save(marker_save):\n from .beeper import load_beeper_from_save\n if marker_save['type']=='beeper':\n  return load_beeper_from_save(marker_save)\n else :\n  return Marker(\n  position=load_position_from_save(marker_save['position'])\n  )\n  \nclass Marker(Piece):\n def __init__(self,position=None ):\n  super().__init__(position=position)\n  self.piece_type='marker'\n  self.marker_type='marker'\n  \n def to_dict(self):\n  marker_dict=super().to_dict().copy()\n  marker_dict['marker_type']=self.marker_type\n  return marker_dict\n  \n def to_save(self):\n  return {\n  'type':'marker',\n  'piece_type':'marker',\n  'position':self.position.to_save()\n  }\n  \n def set_position(self,position):\n  self.position=position\n  if self.world:\n   self.world.on_move(self)\n", ["cs1robots.robot.beeper", "cs1robots.robot.piece"]], "cs1robots.robot.position": [".py", "def load_position_from_save(position_save):\n return Position(position_save['x'],position_save['y'])\n \nclass Position(object):\n def __init__(self,x,y):\n  self.x=x\n  self.y=y\n  \n def __eq__(self,other):\n  return self.x ==other.x and self.y ==other.y\n  \n def __ne__(self,other):\n  return not self ==other\n  \n def __add__(self,other):\n  return Position(self.x+other.x,self.y+other.y)\n  \n def __str__(self):\n  return '(%d, %d)'%(self.x,self.y)\n  \n def clone(self):\n  return Position(self.x,self.y)\n  \n def to_list(self):\n  return [self.x,self.y]\n  \n def to_save(self):\n  return {\n  'type':'position',\n  'x':self.x,\n  'y':self.y\n  }\n", []], "cs1robots.robot.agent": [".py", "from .position import Position,load_position_from_save\nfrom .direction import Direction,load_direction_from_save\nfrom .piece import Piece\n\ndef load_agent_from_save(agent_save):\n from .robot import load_robot_from_save\n if agent_save['type']=='robot':\n  return load_robot_from_save(agent_save)\n else :\n  return Agent(\n  position=load_position_from_save(agent_save['position']),\n  direction=load_direction_from_save(agent_save['direction']),\n  trace=agent_save['trace']\n  )\n  \nclass Agent(Piece):\n def __init__(self,position=None ,direction=None ,trace=None ):\n  super().__init__(position=position);\n  self.direction=Direction('e')if direction is None else direction\n  self.piece_type='agent'\n  self.agent_type='marker'\n  self.trace_color=trace\n  \n def set_trace(self,color='blue'):\n  self.trace_color=color\n  \n def to_dict(self):\n  agent_dict=super().to_dict().copy()\n  agent_dict['agent_type']=self.agent_type\n  agent_dict['trace_color']=self.trace_color\n  agent_dict['direction']=self.direction.to_char()\n  return agent_dict\n  \n def to_save(self):\n  return {\n  'type':'agent',\n  'piece_type':'agent',\n  'position':self.position.to_save(),\n  'direction':self.direction.to_save(),\n  'trace':self.trace_color\n  }\n", ["cs1robots.robot.direction", "cs1robots.robot.piece", "cs1robots.robot.position", "cs1robots.robot.robot"]], "cs1robots.robot.robot": [".py", "from .agent import Agent\nfrom .beeper import Beeper\nfrom .direction import Direction,load_direction_from_save\nfrom .position import Position,load_position_from_save\n\nDEFAULT_PAUSE_DURATION=0\n\ndef load_robot_from_save(robot_save):\n return Robot(\n position=load_position_from_save(robot_save['position']),\n direction=load_direction_from_save(robot_save['direction']),\n beepers=robot_save['beepers'],\n pause=robot_save['pause'],\n trace=robot_save['trace']\n )\n \nclass RobotException(Exception):\n pass\n \nclass Robot(Agent):\n def __init__(self,position=None ,direction=None ,beepers=0,pause=None ,trace=None ):\n  super().__init__(position=position,direction=direction,trace=trace)\n  self.pause_duration=DEFAULT_PAUSE_DURATION if pause is None else pause\n  self.beepers=[]\n  self.position_log=[self.position.to_list()]\n  for _ in range(beepers):\n   self.beepers.append(Beeper())\n  self.agent_type='robot'\n  \n def _is_adjacent_position_clear(self,position):\n  is_front_in_world=self.world.is_in_world(position)\n  is_no_wall_front=not self.world.is_wall_between(self.position,position)\n  return is_front_in_world and is_no_wall_front\n  \n def to_save(self):\n  return {\n  'type':'robot',\n  'piece_type':'agent',\n  'position':self.position.to_save(),\n  'direction':self.direction.to_save(),\n  'beepers':len(self.beepers),\n  'pause':self.pause_duration,\n  'trace':self.trace_color\n  }\n  \n def set_pause(self,duration):\n  self.pause_duration=duration\n  \n def move(self):\n  after_position=self.position+self.direction.get_delta()\n  if not self.world.is_in_world(after_position):\n   raise RobotException('Cannot move! I cannot go out of the world!')\n  if self.world.is_wall_between(self.position,after_position):\n   raise RobotException('Cannot move! There is a wall in front of me!')\n  self.position=after_position\n  self.position_log.append(self.position.to_list())\n  if self.world:\n   self.world.on_move(self)\n   self.world.on_pause(self.pause_duration)\n   \n def turn_left(self):\n  self.direction=self.direction.get_next()\n  if self.world:\n   self.world.on_rotate(self)\n   self.world.on_pause(self.pause_duration)\n   \n def front_is_clear(self):\n  return self._is_adjacent_position_clear(self.position+self.direction.get_delta())\n  \n def left_is_clear(self):\n  return self._is_adjacent_position_clear(self.position+self.direction.get_next().get_delta())\n  \n def right_is_clear(self):\n  return self._is_adjacent_position_clear(self.position+self.direction.get_prev().get_delta())\n  \n def facing_north(self):\n  return self.direction ==Direction('north')\n  \n def carries_beepers(self):\n  return bool(self.beepers)\n  \n def on_beeper(self):\n  return self.world.is_beeper(self.position)\n  \n def pick_beeper(self):\n  beeper=self.world.get_beeper(self.position)\n  if beeper is None :\n   raise RobotException('There is no beeper to pick up!')\n  self.world.remove_piece(beeper)\n  self.beepers.append(beeper)\n  \n def drop_beeper(self):\n  if not self.beepers:\n   raise RobotException('I have no beeper to drop!')\n  beeper=self.beepers.pop()\n  beeper.set_position(self.position.clone())\n  self.world.add_piece(beeper)\n", ["cs1robots.robot.agent", "cs1robots.robot.beeper", "cs1robots.robot.direction", "cs1robots.robot.position"]], "cs1robots.robot.piece": [".py", "from .position import Position,load_position_from_save\nfrom .direction import Direction\n\ndef load_piece_from_save(piece_save):\n from .marker import load_marker_from_save\n from .agent import load_agent_from_save\n if piece_save['piece_type']=='marker':\n  piece=load_marker_from_save(piece_save)\n elif piece_save['piece_type']=='agent':\n  piece=load_agent_from_save(piece_save)\n else :\n  piece=Piece(position=load_position_from_save(piece_save['position']))\n if 'id'in piece_save:\n  piece.id=piece_save['id']\n return piece\n \nclass Piece(object):\n def __init__(self,position=None ):\n  self.id=None\n  self.world=None\n  self.piece_type='piece'\n  self.position=Position(0,0)if position is None else position\n  \n def to_dict(self):\n  return {\n  'id':self.id,\n  'piece_type':self.piece_type,\n  'x':self.position.x,\n  'y':self.position.y\n  }\n  \n def to_save(self):\n  return {\n  'type':'piece',\n  'position':self.position.to_save()\n  }\n", ["cs1robots.robot.agent", "cs1robots.robot.direction", "cs1robots.robot.marker", "cs1robots.robot.position"]]}
__BRYTHON__.update_VFS(scripts)

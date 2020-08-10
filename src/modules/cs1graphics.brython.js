__BRYTHON__.use_VFS = true;
var scripts = {"$timestamp": 1597019798895, "cs1graphics.store": [".py", "__graphics__={}\n__graphics__['objs']={}\n\ndef set_canvas(canvas):\n if 'canvas'in __graphics__:\n  __graphics__['canvas'].close()\n __graphics__['canvas']=canvas\n \ndef remove_canvas(canvas):\n del __graphics__['canvas']\n \ndef create_uid(obj):\n uid=len(__graphics__['objs'])\n __graphics__['objs'][uid]=obj\n return uid\n", []], "cs1graphics.pythonpad_drawer": [".py", "import browser\nimport json\nfrom time import sleep\nfrom .json_drawer import JsonDrawer\n\n\nclass PythonpadDrawer(JsonDrawer):\n def __init__(self,auto_flush=True ):\n  super().__init__(auto_flush)\n  browser.self.sendMsg('screen.cs1graphics.init','')\n  \n def print(self,s):\n  browser.self.sendMsg('screen.cs1graphics.draw',s)\n", ["browser", "cs1graphics.json_drawer", "json", "time"]], "cs1graphics.text_box": [".py", "from .rectangle import Rectangle\n\n\nclass TextBox(Rectangle):\n def __init__(self,*args,**kwargs):\n  raise NotImplementedError(\n  'TextBox is not supported in Pythonpad\\'s cs1graphics.')\n", ["cs1graphics.rectangle"]], "cs1graphics.circle": [".py", "from .fillable_shape import FillableShape\nfrom .point import Point\n\n\nclass Circle(FillableShape):\n def __init__(self,radius=10,centerPt=None ):\n  if not isinstance(radius,(int,float)):\n   raise TypeError('radius must be numeric')\n  if radius <=0:\n   raise ValueError(\"radius must be positive\")\n  if centerPt and not isinstance(centerPt,Point):\n   raise TypeError(\"circle's center must be specified as a Point\")\n   \n  FillableShape.__init__(self)\n  self.radius=radius\n  if centerPt is not None :\n   self.moveTo(centerPt.getX(),centerPt.getY())\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.radius=self.radius\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=FillableShape.draw(self)\n  d['type']='circle'\n  d['radius']=self.radius\n  return d\n  \n def getRadius(self):\n  return self.radius\n  \n def setRadius(self,radius):\n  self.radius=radius\n  self.update()\n", ["cs1graphics.fillable_shape", "cs1graphics.point"]], "cs1graphics.drawable": [".py", "from .event_trigger import _EventTrigger\nfrom .point import Point\nfrom .transform import Transform\nfrom .store import create_uid\n\nclass Drawable(_EventTrigger):\n def __init__(self,reference=None ):\n  _EventTrigger.__init__(self)\n  self.id=create_uid(self)\n  if reference is not None :\n   self.refx=reference.getX()\n   self.refy=reference.getY()\n  self.initx=0\n  self.inity=0\n  self.refx=0\n  self.refy=0\n  self.x=0\n  self.y=0\n  self.depth=50\n  self.transform=Transform()\n  self.container=None\n  \n def __deepcopy__(self,memo={}):\n  drawable=self.__class__.__new__(self.__class__)\n  drawable.id=create_uid(drawable)\n  drawable.initx=self.initx\n  drawable.inity=self.inity\n  drawable.refx=self.refx\n  drawable.refy=self.refy\n  drawable.x=self.x\n  drawable.y=self.y\n  drawable.depth=self.depth\n  drawable.transform=self.transform\n  drawable.container=None\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  return {\n  'id':self.id,\n  'initx':self.initx,\n  'inity':self.inity,\n  'refx':self.refx,\n  'refy':self.refy,\n  'x':self.x,\n  'y':self.y,\n  'depth':self.depth,\n  'transform':self.transform.to_matrix_string(),\n  }\n  \n def on_add(self,container):\n  self.container=container\n  \n def on_remove(self,container):\n  self.container=None\n  \n def update(self):\n  if self.container:\n   self.container.on_edit(self)\n   \n def adjustReference(self,dx,dy):\n  self.refx +=dx\n  self.refy +=dy\n  self.update()\n  \n def clone(self):\n  pass\n  \n def setDepth(self,depth):\n  self.depth=depth\n  self.update()\n  \n def getDepth(self):\n  return self.depth\n  \n def getReferencePoint(self):\n  return Point(self.x+self.refx,self.y+self.refy)\n  \n def getRefTransform(self):\n  return Transform.translate(self.x+self.refx,self.y+self.refy)\n  \n def getInvRefTransform(self):\n  return Transform.translate(-self.x -self.refx,-self.y -self.refy)\n  \n def applyTransformWithRef(self,transform):\n  self.transform=(\n  self.getRefTransform()*\n  transform *\n  self.getInvRefTransform()*\n  self.transform\n  )\n  \n def move(self,dx,dy):\n  self.x +=dx\n  self.y +=dy\n  self.transform=Transform.translate(dx,dy)*self.transform\n  self.update()\n  \n def moveTo(self,x,y):\n  dx=x -self.x\n  dy=y -self.y\n  self.x=x\n  self.y=y\n  self.transform=Transform.translate(dx,dy)*self.transform\n  self.update()\n  \n def rotate(self,angle):\n  self.applyTransformWithRef(Transform.rotateAngle(angle))\n  self.update()\n  \n def scale(self,factor):\n  self.applyTransformWithRef(Transform.scale(factor,factor))\n  self.update()\n  \n def stretch(self,xFactor,yFactor,angle=0):\n  self.applyTransformWithRef(\n  Transform.rotateAngle(angle)*\n  Transform.scale(xFactor,yFactor)*\n  Transform.rotateAngle(-angle)\n  )\n  self.update()\n  \n def shear(self,shear,angle=0):\n  self.applyTransformWithRef(\n  Transform.rotateAngle(angle)*\n  Transform.shear(shear)*\n  Transform.rotateAngle(-angle)\n  )\n  self.update()\n  \n def flip(self,angle=0):\n  self.applyTransformWithRef(\n  Transform.rotateAngle(angle)*\n  Transform.flip()*\n  Transform.rotateAngle(-angle)\n  )\n  self.update()\n", ["cs1graphics.event_trigger", "cs1graphics.point", "cs1graphics.store", "cs1graphics.transform"]], "cs1graphics.json_drawer": [".py", "import json\n\nclass JsonDrawer(object):\n def __init__(self,auto_flush=True ):\n  super().__init__()\n  self.auto_flush=auto_flush\n  self.task_queue=[]\n  \n def print(self,s):\n  print(s)\n  \n def print_dict(self,out_dict):\n  self.print(out_dict)\n  \n def flush(self):\n  while self.task_queue:\n   self.print_dict(self.task_queue.pop())\n   \n def add_task(self,task_dict):\n  if self.auto_flush:\n   self.print_dict(task_dict)\n  else :\n   self.task_queue.append(task_dict)\n   \n def on_create_canvas(self,canvas):\n  canvas_dict=canvas.draw()\n  self.add_task({\n  'task':'create_canvas',\n  'canvas':canvas_dict,\n  })\n  \n def on_remove_canvas(self):\n  self.add_task({\n  'task':'remove_canvas',\n  })\n  \n def on_edit_canvas(self,canvas):\n  canvas_dict=canvas.draw()\n  self.add_task({\n  'task':'edit_canvas',\n  'canvas':canvas_dict,\n  })\n  \n def on_add(self,container,drawable):\n  drawable_dict=drawable.draw()\n  task_dict={\n  'task':'add',\n  'container_id':container.id,\n  'drawable':drawable_dict,\n  }\n  self.add_task(task_dict)\n  \n def on_remove(self,container,drawable):\n  task_dict={\n  'task':'remove',\n  'container_id':container.id,\n  'drawable_id':drawable.id,\n  }\n  self.add_task(task_dict)\n  \n def on_edit(self,drawable):\n  drawable_dict=drawable.draw()\n  task_dict={\n  'task':'edit',\n  'drawable':drawable_dict,\n  }\n  self.add_task(task_dict)\n", ["json"]], "cs1graphics.fillable_shape": [".py", "from .shape import Shape\n\nclass FillableShape(Shape):\n def __init__(self,reference=None ):\n  Shape.__init__(self,reference)\n  self.fillColor='transparent'\n  \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.fillColor=self.fillColor\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Shape.draw(self)\n  d['fillColor']=self.fillColor\n  return d\n  \n def getFillColor(self):\n  return self.fillColor\n  \n def setFillColor(self,color):\n  self.fillColor=color\n  self.update()\n", ["cs1graphics.shape"]], "cs1graphics.polygon": [".py", "from .fillable_shape import FillableShape\nfrom .path import Path\nfrom .point import Point\n\n\nclass Polygon(Path,FillableShape):\n def __init__(self,*points):\n  FillableShape.__init__(self)\n  try :\n   Path.__init__(self,*points)\n  except TypeError:\n   raise\n  self.closePath=True\n  \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.closePath=self.closePath\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Path.draw(self)\n  d['type']='polygon'\n  d['fillColor']=self.fillColor\n  return d\n", ["cs1graphics.fillable_shape", "cs1graphics.path", "cs1graphics.point"]], "cs1graphics": [".py", "from .canvas import Canvas\nfrom .point import Point\nfrom .rectangle import Rectangle\nfrom .square import Square\nfrom .circle import Circle\nfrom .ellipse import Ellipse\nfrom .path import Path\nfrom .polygon import Polygon\nfrom .layer import Layer\nfrom .text import Text\nfrom .button import Button\nfrom .text_box import TextBox\nfrom .image import Image\n\n__all__=[\n'Canvas',\n'Point',\n'Rectangle',\n'Square',\n'Circle',\n'Ellipse',\n'Path',\n'Polygon',\n'Layer',\n'Text',\n'Button',\n'TextBox',\n'Image',\n]\n", ["cs1graphics.button", "cs1graphics.canvas", "cs1graphics.circle", "cs1graphics.ellipse", "cs1graphics.image", "cs1graphics.layer", "cs1graphics.path", "cs1graphics.point", "cs1graphics.polygon", "cs1graphics.rectangle", "cs1graphics.square", "cs1graphics.text", "cs1graphics.text_box"], 1], "cs1graphics.point": [".py", "class Point(object):\n def __init__(self,initialX=0,initialY=0):\n  if not isinstance(initialX,(int,float)):\n   raise TypeError('x-coordinate must be a number')\n   \n  if not isinstance(initialY,(int,float)):\n   raise TypeError('y-coordinate must be a number')\n   \n  self._x=initialX\n  self._y=initialY\n  \n def getX(self):\n  return self._x\n  \n def setX(self,val):\n  if not isinstance(val,(int,float)):\n   raise TypeError('x-coordinate must be a number')\n  self._x=val\n  \n def getY(self):\n  return self._y\n  \n def setY(self,val):\n  if not isinstance(val,(int,float)):\n   raise TypeError('y-coordinate must be a number')\n  self._y=val\n  \n def get(self):\n  return self._x,self._y\n  \n def scale(self,factor):\n  if not isinstance(factor,(int,float)):\n   raise TypeError('scaling factor must be a number')\n  self._x *=factor\n  self._y *=factor\n  \n def distance(self,other):\n  if not isinstance(other,Point):\n   raise TypeError('other must be a Point instance')\n  dx=self._x -other._x\n  dy=self._y -other._y\n  return _math.sqrt(dx *dx+dy *dy)\n  \n def normalize(self):\n  mag=self.distance(Point())\n  if mag >0:\n   self.scale(1. /mag)\n   \n def __str__(self):\n  return '<'+str(self._x)+','+str(self._y)+'>'\n  \n def __neg__(self):\n  return Point(-self._x,-self._y)\n  \n def __add__(self,other):\n  if not isinstance(other,Point):\n   raise TypeError('both operands must be Point instances')\n  return Point(self._x+other._x,self._y+other._y)\n  \n def __sub__(self,other):\n  if not isinstance(other,Point):\n   raise TypeError('both operands must be Point instances')\n  return Point(self._x -other._x,self._y -other._y)\n  \n def __mul__(self,operand):\n  if isinstance(operand,(int,float)):\n   return Point(self._x *operand,self._y *operand)\n  elif isinstance(operand,Point):\n   return self._x *operand._x+self._y *operand._y\n  else :\n   raise TypeError('unexpected operand for multiplication')\n   \n def __rmul__(self,operand):\n  return self *operand\n  \n def __xor__(self,angle):\n  if not isinstance(angle,(int,float)):\n   raise TypeError('angle must be a number')\n  angle=_math.pi *angle /180.\n  return Point(self._x *_math.cos(angle)-self._y *_math.sin(angle),\n  self._x *_math.sin(angle)+self._y *_math.cos(angle))\n", []], "cs1graphics.button": [".py", "from .rectangle import Rectangle\n\n\nclass Button(Rectangle):\n def __init__(self,*args,**kwargs):\n  raise NotImplementedError('Button is not supported in Pythonpad\\'s cs1graphics.')\n", ["cs1graphics.rectangle"]], "cs1graphics.transform": [".py", "from math import pi,sin,cos,sqrt\n\nclass Transform(object):\n def __init__(self,a=1,b=0,c=0,d=1,e=0,f=0):\n  self.a=a\n  self.b=b\n  self.c=c\n  self.d=d\n  self.e=e\n  self.f=f\n  \n def __mul__(self,op):\n  if isinstance(op,Transform):\n   return Transform(\n   self.a *op.a+self.c *op.b,\n   self.b *op.a+self.d *op.b,\n   self.a *op.c+self.c *op.d,\n   self.b *op.c+self.d *op.d,\n   self.a *op.e+self.c *op.f+self.e,\n   self.b *op.e+self.d *op.f+self.f\n   )\n  else :\n   raise TypeError('unexpected operand for multiplication')\n   \n def to_list(self):\n  return [self.a,self.b,self.c,self.d,self.e,self.f]\n  \n def to_matrix_string(self):\n  return 'matrix(%s %s %s %s %s %s)'%(self.a,self.b,self.c,self.d,self.e,self.f)\n  \n @staticmethod\n def translate(tx,ty):\n  return Transform(1,0,0,1,tx,ty)\n  \n @staticmethod\n def scale(sx,sy):\n  return Transform(sx,0,0,sy,0,0)\n  \n @staticmethod\n def rotate(rad):\n  return Transform(cos(rad),sin(rad),-sin(rad),cos(rad),0,0)\n  \n @staticmethod\n def rotateAngle(a):\n  return Transform.rotate(a *(pi /180))\n  \n @staticmethod\n def shear(shear):\n  return Transform(1,-shear,0,1,0,0)\n  \n @staticmethod\n def flip():\n  return Transform(-1,0,0,1,0,0)\n", ["math"]], "cs1graphics.text": [".py", "from .drawable import Drawable\nfrom .point import Point\n\nPT_PIXEL_RATIO=1.32\n\nclass Text(Drawable):\n def __init__(self,message='',fontsize=12,centerPt=None ):\n  if not isinstance(message,str):\n   raise TypeError('message must be a string')\n  if not isinstance(fontsize,(int,float)):\n   raise TypeError('fontsize must be numeric')\n  if fontsize <=0:\n   raise ValueError('fontsize must be positive')\n  if centerPt and not isinstance(centerPt,Point):\n   raise TypeError('center must be a Point')\n   \n  Drawable.__init__(self)\n  self.text=message\n  self.size=fontsize\n  self.color=[0,0,0]\n  self.initx=-self.getRenderedWidth()/2\n  self.inity=-self.getRenderedHeight()/2\n  if centerPt:\n   self.move(centerPt.getX(),centerPt.getY())\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.text=self.text\n  drawable.size=self.size\n  drawable.color=self.color\n  drawable.initx=self.initx\n  drawable.inity=self.inity\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Drawable.draw(self)\n  d['type']='text'\n  d['initx']=self.initx\n  d['inity']=self.inity\n  d['text']=self.text\n  d['size']=self.size *PT_PIXEL_RATIO\n  d['color']=self.color\n  return d\n  \n def getRenderedWidth(self):\n  lines=self.text.split('\\n')\n  maxlen=max([len(line)for line in lines])\n  return self.size *PT_PIXEL_RATIO *0.5 *maxlen\n  \n def getRenderedHeight(self):\n  lines=self.text.split('\\n')\n  return self.size *PT_PIXEL_RATIO *len(lines)\n  \n def getDimensions(self):\n  return self.getRenderedWidth(),self.getRenderedHeight()\n  \n def getFontColor(self):\n  return self.color\n  \n def getFontSize(self):\n  return self.size\n  \n def getMessage(self):\n  return self.text\n  \n def setFontColor(self,color):\n  self.color=color\n  self.update()\n  \n def setFontSize(self,fontsize):\n  self.size=fontsize\n  self.initx=-self.getRenderedWidth()/2\n  self.inity=-self.getRenderedHeight()/2\n  self.update()\n  \n def setMessage(self,message):\n  self.text=message\n  self.initx=-self.getRenderedWidth()/2\n  self.inity=-self.getRenderedHeight()/2\n  self.update()\n", ["cs1graphics.drawable", "cs1graphics.point"]], "cs1graphics.rectangle": [".py", "from .fillable_shape import FillableShape\nfrom .point import Point\n\nclass Rectangle(FillableShape):\n def __init__(self,w=20,h=10,centerPt=None ):\n  if not isinstance(w,(int,float)):\n   raise TypeError('width must be numeric')\n  if w <=0:\n   raise ValueError('width must be positive')\n  if not isinstance(h,(int,float)):\n   raise TypeError('height must be numeric')\n  if h <=0:\n   raise ValueError('height must be positive')\n  if centerPt and not isinstance(centerPt,Point):\n   raise TypeError('center must be specified as a Point')\n   \n  FillableShape.__init__(self)\n  self.width=w\n  self.height=h\n  self.initx=-w /2\n  self.inity=-h /2\n  if centerPt is not None :\n   self.moveTo(centerPt.getX(),centerPt.getY())\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.width=self.width\n  drawable.height=self.height\n  drawable.initx=self.initx\n  drawable.inity=self.inity\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=FillableShape.draw(self)\n  d['type']='rectangle'\n  d['width']=self.width\n  d['height']=self.height\n  return d\n  \n def getHeight(self):\n  return self.height\n  \n def getWidth(self):\n  return self.width\n  \n def setHeight(self,h):\n  self.inity=-h /2\n  self.height=h\n  self.update()\n  \n def setWidth(self,w):\n  self.initx=-w /2\n  self.width=w\n  self.update()\n", ["cs1graphics.fillable_shape", "cs1graphics.point"]], "cs1graphics.layer": [".py", "from .drawable import Drawable\nfrom .graphics_container import _GraphicsContainer\n\nclass Layer(Drawable,_GraphicsContainer):\n def __init__(self):\n  Drawable.__init__(self)\n  _GraphicsContainer.__init__(self)\n  \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Drawable.draw(self)\n  d['type']='layer'\n  return d\n  \n def set_drawer(self,drawer):\n  self.drawer=drawer\n  self.drawer.on_add(self.container,self)\n  for obj in self.objs:\n   if isinstance(obj,_GraphicsContainer):\n    obj.set_drawer(self.container.drawer)\n   else :\n    self.drawer.on_add(self,obj)\n    \n def on_remove(self,container):\n  self.clear()\n  self.drawer=None\n  Drawable.on_remove(self,container)\n", ["cs1graphics.drawable", "cs1graphics.graphics_container"]], "cs1graphics.shape": [".py", "from .drawable import Drawable\n\nclass Shape(Drawable):\n def __init__(self,reference=None ):\n  Drawable.__init__(self,reference)\n  self.borderColor=(0,0,0)\n  self.borderWidth=1\n  \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.borderColor=self.borderColor\n  drawable.borderWidth=self.borderWidth\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Drawable.draw(self)\n  d['borderColor']=self.borderColor\n  d['borderWidth']=self.borderWidth\n  return d\n  \n def getBorderColor(self):\n  return self.borderColor\n  \n def getBorderWidth(self):\n  return self.borderWidth\n  \n def setBorderColor(self,color):\n  self.borderColor=color\n  self.update()\n  \n def setBorderWidth(self,width):\n  self.borderWidth=width\n  self.update()\n", ["cs1graphics.drawable"]], "cs1graphics.ellipse": [".py", "from .fillable_shape import FillableShape\nfrom .point import Point\n\n\nclass Ellipse(FillableShape):\n def __init__(self,w=20,h=10,centerPt=None ):\n  if not isinstance(w,(int,float)):\n   raise TypeError('width must be numeric')\n  if w <=0:\n   raise ValueError('width must be positive')\n  if not isinstance(h,(int,float)):\n   raise TypeError('height must be numeric')\n  if h <=0:\n   raise ValueError('height must be positive')\n  if centerPt and not isinstance(centerPt,Point):\n   raise TypeError('center must be specified as a Point')\n   \n  FillableShape.__init__(self)\n  self.width=w\n  self.height=h\n  if centerPt is not None :\n   self.moveTo(centerPt.getX(),centerPt.getY())\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.width=self.width\n  drawable.height=self.height\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=FillableShape.draw(self)\n  d['type']='ellipse'\n  d['width']=self.width\n  d['height']=self.height\n  return d\n  \n def getHeight(self):\n  return self.height\n  \n def getWidth(self):\n  return self.width\n  \n def setHeight(self,h):\n  self.height=h\n  self.update()\n  \n def setWidth(self,w):\n  self.width=w\n  self.update()\n", ["cs1graphics.fillable_shape", "cs1graphics.point"]], "cs1graphics.square": [".py", "from .rectangle import Rectangle\nfrom .point import Point\n\nclass Square(Rectangle):\n def __init__(self,size=10,centerPt=None ):\n  if not isinstance(size,(int,float)):\n   raise TypeError('size must be numeric')\n  if size <=0:\n   raise ValueError('size must be positive')\n  if centerPt and not isinstance(centerPt,Point):\n   raise TypeError('center must be specified as a Point')\n   \n  Rectangle.__init__(self,size,size,centerPt)\n  \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Rectangle.draw(self)\n  d['type']='square'\n  return d\n  \n def getSize(self):\n  return self.getWidth()\n  \n def setSize(self,s):\n  if not isinstance(s,(int,float)):\n   raise TypeError('size must be numeric')\n  if s <=0:\n   raise ValueError('size must be positive')\n   \n  Rectangle.setWidth(self,s)\n  Rectangle.setHeight(self,s)\n  self.update()\n  \n def setWidth(self,w):\n  if not isinstance(w,(int,float)):\n   raise TypeError('width must be numeric')\n  if w <=0:\n   raise ValueError(\"width must be positive\")\n  self.setSize(w)\n  self.update()\n  \n def setHeight(self,h):\n  if not isinstance(h,(int,float)):\n   raise TypeError('height must be numeric')\n  if h <=0:\n   raise ValueError(\"height must be positive\")\n  self.setSize(h)\n  self.update()\n", ["cs1graphics.point", "cs1graphics.rectangle"]], "cs1graphics.path": [".py", "from .shape import Shape\nfrom .point import Point\n\n\nclass Path(Shape):\n def __init__(self,*points):\n  Shape.__init__(self)\n  \n  for p in points:\n   if not isinstance(p,Point):\n    raise TypeError('non-Point specified as parameter')\n    \n  self.points=list(points)\n  self.closePath=False\n  if len(self.points)>=1:\n   self.adjustReference(self.points[0].getX(),self.points[0].getY())\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.points=self.points.copy()\n  drawable.closePath=self.closePath\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Shape.draw(self)\n  d['type']='path'\n  d['d']=self.getDirection()if self.points else ''\n  return d\n  \n def getDirection(self):\n  coords=[]\n  cmd='M'\n  for point in self.points:\n   coords.append('%s%s %s'%(cmd,point.getX(),point.getY()))\n   cmd='L'\n  if self.closePath:\n   coords.append('Z')\n  return ' '.join(coords)\n  \n def addPoint(self,point,index=-1):\n  if not isinstance(point,Point):\n   raise TypeError('parameter must be a Point instance')\n  if index >-1:\n   self.points.insert(index,point)\n  else :\n   self.points.append(point)\n  if len(self.points)==1:\n   self.refx=point.getX()\n   self.refy=point.getY()\n   \n def deletePoint(self,index=-1):\n  if not isinstance(index,int):\n   raise TypeError('index must be an integer')\n  try :\n   self.points.pop(index)\n  except IndexError:\n   raise IndexError('index out of range')\n  self.update()\n  \n def clearPoints(self):\n  self.points=list()\n  self.update()\n  \n def getNumberOfPoints(self):\n  return len(self.points)\n  \n def getPoint(self,index):\n  if not isinstance(index,int):\n   raise TypeError('index must be an integer')\n  try :\n   p=self.points[index]\n  except IndexError:\n   raise IndexError('index out of range')\n  return Point(p.getX(),p.getY())\n  \n def setPoint(self,point,index=-1):\n  if not isinstance(index,int):\n   raise TypeError('index must be an integer')\n  if not isinstance(point,Point):\n   raise TypeError('first parameter must be a Point instance')\n  try :\n   self.points[index]=point\n  except IndexError:\n   raise IndexError('index out of range')\n  self.update()\n  \n def getPoints(self):\n  return list(self.points)\n", ["cs1graphics.point", "cs1graphics.shape"]], "cs1graphics.image": [".py", "import browser\nimport os\nfrom .drawable import Drawable\nfrom .point import Point\n\nclass Image(Drawable):\n def __init__(self,*args):\n  Drawable.__init__(self)\n  \n  if not 1 <=len(args)<=2:\n   raise TypeError('must specify a filename')\n  elif len(args)==2:\n   raise NotImplementedError('cs1graphics in Pythonpad does not support Image with width and height')\n   \n  if not isinstance(args[0],str):\n   raise TypeError('filename must be a string')\n   \n  try :\n   self.filename=os.path.normpath(args[0])\n  except :\n   raise ValueError('filename is not valid')\n   \n  if not browser.self.isFileExist(self.filename):\n   raise ValueError('unable to load image file: '+self.filename)\n   \n def __deepcopy__(self,memo={}):\n  drawable=super().__deepcopy__()\n  drawable.filename=self.filename\n  return drawable\n  \n def clone(self):\n  return self.__deepcopy__()\n  \n def draw(self):\n  d=Drawable.draw(self)\n  d['type']='image'\n  d['filename']=self.filename\n  return d\n  \n def getWidth(self):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support getWidth')\n  \n def getHeight(self):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support getHeight')\n  \n def getPixel(self,x,y):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support getPixel')\n  \n def setPixel(self,x,y,color):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support setPixel')\n  \n def updatePixels(self):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support updatePixels')\n", ["browser", "cs1graphics.drawable", "cs1graphics.point", "os"]], "cs1graphics.graphics_container": [".py", "class _GraphicsContainer(object):\n def __init__(self,drawer=None ):\n  self.objs=[]\n  self.drawer=drawer\n  \n def __contains__(self,obj):\n  return obj in self.objs\n  \n def init_drawer(self,drawer):\n  self.drawer=drawer\n  for drawable in self.objs:\n   self.drawer.on_add(self,drawable)\n   if isinstance(drawable,_GraphicsContainer):\n    drawable.init_drawer(self.drawer)\n    \n def on_edit(self,drawable):\n  if self.drawer:\n   self.drawer.on_edit(drawable)\n   \n def add(self,drawable):\n  if drawable not in self:\n   self.objs.append(drawable)\n   drawable.on_add(self)\n   if self.drawer:\n    self.drawer.on_add(self,drawable)\n    if isinstance(drawable,_GraphicsContainer):\n     drawable.init_drawer(self.drawer)\n     \n def clear(self):\n  for obj in self.objs:\n   self.remove(obj)\n   \n def getContents(self):\n  self.objs.sort(key=lambda x:x.depth)\n  return self.objs\n  \n def remove(self,drawable):\n  if drawable in self:\n   self.objs=[obj for obj in self.objs if obj !=drawable]\n   drawable.on_remove(self)\n   if self.drawer:\n    self.drawer.on_remove(self,drawable)\n", []], "cs1graphics.canvas": [".py", "from .event_trigger import _EventTrigger\nfrom .graphics_container import _GraphicsContainer\nfrom .pythonpad_drawer import PythonpadDrawer\nfrom .store import set_canvas,remove_canvas,create_uid\n\nclass Canvas(_EventTrigger,_GraphicsContainer):\n def __init__(self,w=200,h=200,bgColor=None ,title='Graphics canvas',autoRefresh=True ):\n  self.drawer=PythonpadDrawer(auto_flush=autoRefresh)\n  _EventTrigger.__init__(self)\n  _GraphicsContainer.__init__(self,self.drawer)\n  self.id=create_uid(self)\n  self.width=w\n  self.height=h\n  self.bgColor=bgColor\n  self.title=title\n  self.objs=[]\n  set_canvas(self)\n  self.drawer.on_create_canvas(self)\n  \n def draw(self):\n  return {\n  'type':'canvas',\n  'id':self.id,\n  'width':self.width,\n  'height':self.height,\n  'bgColor':self.bgColor,\n  'title':self.title,\n  }\n  \n def close(self):\n  self.drawer.on_remove_canvas()\n  remove_canvas(self)\n  \n def getBackgroundColor(self):\n  return self.bgColor\n  \n def getHeight(self):\n  return self.height\n  \n def getWidth(self):\n  return self.width\n  \n def open(self):\n  pass\n  \n def refresh(self,force=False ):\n  if force:\n   objs=self.objs.copy()\n   self.clear()\n   for obj in objs:\n    self.add(obj)\n  self.drawer.flush()\n  \n def saveToFile(self,filename):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support saveToFile.')\n  \n def setAutoRefresh(self,autoRefresh=True ):\n  self.drawer.auto_flush=autoRefresh\n  \n def setBackgroundColor(self,color):\n  self.bgColor=color\n  self.drawer.on_edit_canvas(self)\n  \n def setHeight(self,h):\n  self.height=h\n  self.drawer.on_edit_canvas(self)\n  \n def setTitle(self,title):\n  self.title=title\n  self.drawer.on_edit_canvas(self)\n  \n def setWidth(self,w):\n  self.width=w\n  self.drawer.on_edit_canvas(self)\n", ["cs1graphics.event_trigger", "cs1graphics.graphics_container", "cs1graphics.pythonpad_drawer", "cs1graphics.store"]], "cs1graphics.event_trigger": [".py", "class _EventTrigger(object):\n def __init__(self):\n  pass\n  \n def raiseEventError(self):\n  raise NotImplementedError('cs1graphics in Pythonpad does not support events.')\n  \n def addHandler(self,handler):\n  self.raiseEventError()\n  \n def removeHandler(self,handler):\n  self.raiseEventError()\n  \n def wait(self):\n  self.raiseEventError()\n", []]}
__BRYTHON__.update_VFS(scripts)

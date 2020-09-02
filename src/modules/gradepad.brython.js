__BRYTHON__.use_VFS = true;
var scripts = {"$timestamp": 1599052060809, "gradepad": [".py", "from .stdout_collector import StdoutCollector\n\n__all__=[\n'StdoutCollector',\n]\n", ["gradepad.stdout_collector"], 1], "gradepad.stdout_collector": [".py", "\nclass StdoutCollector:\n def __init__(self):\n  self.data_list=[]\n  \n def __enter__(self):\n  self.stdoutbak=sys.stdout\n  sys.stdout=self\n  return self\n  \n def __exit__(self,*args):\n  sys.stdout=self.stdoutbak\n  \n def write(self,data=''):\n  self.data_list.append(str(data))\n  \n def flush(self):\n  pass\n  \n def get_output(self):\n  return ''.join(self.data_list)\n", []]}
__BRYTHON__.update_VFS(scripts)
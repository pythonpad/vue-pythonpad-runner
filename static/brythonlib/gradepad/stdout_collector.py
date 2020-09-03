import sys


class StdoutCollector:
    def __init__(self):
        self.data_list = []
        
    def __enter__(self):
        self.stdoutbak = sys.stdout
        sys.stdout = self
        return self
        
    def __exit__(self, *args):
        sys.stdout = self.stdoutbak
        
    def write(self, data=''):
        self.data_list.append(str(data))

    def flush(self):
        pass
        
    def get_output(self):
        return ''.join(self.data_list)
        
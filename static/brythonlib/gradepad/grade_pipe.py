import sys
import browser

class GradePipe:
    def __init__(self):
        self.data_list = []
        self.input_data_list = []
        self.input_count = 0
        
    def __enter__(self):
        self.stdoutbak = sys.stdout
        sys.stdout = self
        return self
        
    def __exit__(self, *args):
        sys.stdout = self.stdoutbak
        if self.promptbak:
            browser.self.prompt = self.promptbak
        
    def write(self, data=''):
        self.data_list.append(str(data))

    def flush(self):
        pass

    def prompt(self, *args):
        self.input_count += 1
        if self.input_data_list:
            return self.input_data_list.pop(0) + '\n'
        else:
            return ''

    def set_inputs(self, inputs):
        self.promptbak = browser.self.prompt
        browser.self.prompt = self.prompt
        self.input_data_list = inputs
        
    def get_output(self):
        return ''.join(self.data_list)

    def get_input_count(self):
        return self.input_count
        
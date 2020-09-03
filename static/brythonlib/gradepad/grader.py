import sys


class Test:
    def __init__(self, grader, desc, fail_msg):
        self.grader = grader
        self.desc = desc
        self.fail_msg = fail_msg
        self.failed = False
        
    def fail(self):
        self.failed = True
        
    def expect(self, value):
        if not value:
            self.fail()
            
    def print_error(self, msg):
        sys.stderr.write(str(msg) + '\n')
        
    def print_result(self, error=False):
        if self.failed:
            self.print_error('- (X) %s' % self.desc)
            if self.fail_msg:
                self.print_error('** %s' % self.fail_msg)
        else:
            if error:
                self.print_error('- (?) %s' % self.desc)
            else:
                print('- (O) %s' % self.desc)
        

class Grader:
    def __init__(self, pass_msg=None):
        print('Grading...')
        self.pass_msg = pass_msg
        self.failed = False
        self.tests = []
        
    def test(self, desc, fail_msg=None):
        test = Test(self, desc, fail_msg)
        self.tests.append(test)
        return test
        
    def save_passed_state(self):
        f = open('.passed.json', 'w')
        f.close()
        
    def print_error(self, msg):
        sys.stderr.write(str(msg) + '\n')
        
    def done(self):
        test_count = len(self.tests)
        pass_count = len([1 for t in self.tests if not t.failed])
        for test in self.tests:
            test.print_result(error=self.failed)
            
        print()
        if self.failed:
            self.print_error('Failed to finish the grading. \nPlease fix your code and try again!')
        elif test_count == pass_count:
            if self.pass_msg:
                print(self.pass_msg)
            else:
                print('Everything is in place! Well done!')
            self.save_passed_state()
        else:
            self.print_error('Passed %d/%d tests. Please try again!' % (pass_count, test_count))
            
    def fail(self):
        self.failed = True
            
    def run(self, grade):
        try:
            grade(self)
        except Exception as e:
            self.print_error('An error has occurred in your code while grading. Failed to grade the code.')
            raise e
        self.done()
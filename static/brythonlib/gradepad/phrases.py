class Phrase(object):
    pass


def create_phrase_en():
    p = Phrase()
    p.grading = 'Grading'
    p.grading_failed = 'Failed to finish the grading. \nPlease fix your code and try again!'
    p.grading_passed = 'Everything is in place! Well done!'
    p.try_again = 'Passed {pass_count}/{test_count} tests. Please try again!'
    p.error_occurred = 'An error has occurred in your code while grading. Failed to grade the code.'
    return p

def create_phrase_ko():
    p = Phrase()
    p.grading = '채점 중'
    p.grading_failed = '채점을 완료하지 못 했습니다. \n코드의 에러를 고친 후 다시 시도해주세요!'
    p.grading_passed = '모든 테스트를 통과했습니다! 훌륭해요!'
    p.try_again = '테스트 {test_count}개 중 {pass_count}개를 통과했습니다. 코드를 수정하고 다시 시도해주세요!'
    p.error_occurred = '채점 중 코드에서 에러가 발생했습니다. 에러를 고쳐주셔야 채점을 할 수 있어요.'
    return p

def load_phrase(locale):
    if locale == 'en':
        return create_phrase_en()
    elif locale == 'ko':
        return create_phrase_ko()
    else:
        return create_phrase_en()

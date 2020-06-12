import browser

def send(text):
    browser.self.sendMsg('send_text', text)

import browser

def send(text):
    browser.self.sendMsg('send_text', text)

# def receive(*options):
#     if options:
#         pass
#     else:
#         browser.self
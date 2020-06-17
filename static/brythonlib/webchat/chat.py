import browser

def send(text):
    browser.self.sendMsg('send_text', text)

async def receive():
    browser.self.sendMsg('receive_text')
    value = await browser.self.receiveMsg('input.text')
    return value

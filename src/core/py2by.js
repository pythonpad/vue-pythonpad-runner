const fs = require('fs')

function wrapPythonCode(code) {
    const newCodeLines = []
    newCodeLines.push('from browser import aio')
    newCodeLines.push('from webchat import print, input')
    newCodeLines.push('def __p2b_main__():')
    for (const line of code.split('\n')) {
        newCodeLines.push(' ' + line)
    }
    newCodeLines.push('aio.run(__p2b_main__())')
    return newCodeLines.join('\n')
}

function asynciofy(code) {
    let converted = code
    converted = converted.replace(/def\s+\w+\s*\([^)]*\)/g, g0 => `async ${g0}`)
    return converted
}

let code = fs.readFileSync('test.py', 'utf8')
code = asynciofy(code)
code = wrapPythonCode(code)
console.log(code)
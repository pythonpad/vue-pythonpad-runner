
function Pythonpad(target, data={}) {
    // Init store.
    const store = {
        isSaved: true
    }
    // Init methods.
    const methods = {}

    window.addEventListener('beforeunload', e => {
        if (!store.isSaved) {
            e.preventDefault()
            // Chrome requires returnValue to be set
            e.returnValue = ''
        }
    })

    // Add styles.
    const stylesString = `
        .Pythonpad {
            box-sizing: border-box;
            position: relative;
            padding-top: 32px;
            width: 100%;
            height: 100%;
        }
        .Pythonpad__header {
            box-sizing: border-box;
            background-color: #444;
            padding: 0 8px;
            position: absolute;
            color: #fff;
            font-size: 14px;
            line-height: 32px;
            height: 32px;
            width: 100%;
            top: 0;
            left: 0;
        }
        .Pythonpad__app {
            width: 100%;
            height: 100%;
        }
    `
    const styleElement = document.createElement('style')
    document.head.appendChild(styleElement)
    styleElement.type = 'text/css'
    styleElement.appendChild(document.createTextNode(stylesString))

    // Set pad ID and the target element.
    let element = null
    let padId = data.id
    if (typeof target === 'string') {
        element = document.getElementById(target)
        if (typeof padId === 'undefined') {
            padId = target
        }
    } else {
        element = target
        if (typeof padId === 'undefined') {
            padId = element.id
        }
    }

    if (!padId) {
        console.error('id value in given data parameter or id attribute in given target DOM element is required.')
        return
    }

    // Set local storage save key.
    const saveSrcKey = `Pythonpad-save-src-${padId}`
    const saveFilesKey = `Pythonpad-save-files-${padId}`

    // Set values.
    const initSrc = data.src || 'print(\'hello world\')'
    const initFiles = data.files || {}
    const buttons = []

    if (data.downloadable) {
        buttons.push({
            label: 'Download',
            fa: 'download',
            callback: () => methods.download(),
        })
    }

    buttons.push({
        label: 'Reset',
        fa: 'undo',
        class: 'is-danger',
        callback: () => methods.reset(),
    })

    methods.download = () => {
        const downloadTextAsFile = (filename, text) => {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }
        if (!store.isSaved) {
            alert('There are unsaved changes. Be aware that you are downloading your latest saved state.')
        }
        const src = localStorage.getItem(saveSrcKey)
        const files = JSON.parse(localStorage.getItem(saveFilesKey))
        downloadTextAsFile(`${padId}.pypad.json`, JSON.stringify({
            id: padId,
            title: data.title || padId,
            src,
            files, 
        }))
    }

    methods.reset = () => {
        if (confirm('Remove all modifications and reload the initial state?')) {
            localStorage.setItem(saveSrcKey, initSrc)
            localStorage.setItem(saveFilesKey, JSON.stringify(initFiles))
            element.innerHTML = ''
            methods.render()
        }
    }

    methods.render = () => {
        // Add the container element.
        const containerElement = document.createElement('div')
        containerElement.classList.add('Pythonpad')

        const headerElement = document.createElement('div')
        headerElement.classList.add('Pythonpad__header')
        const appElement = document.createElement('div')
        appElement.classList.add('Pythonpad__app')

        containerElement.appendChild(headerElement)
        containerElement.appendChild(appElement)

        document.body.appendChild(containerElement)

        // Add title to the header.
        const title = document.createTextNode(data.title || padId)
        headerElement.appendChild(title)

        element.appendChild(containerElement)

        // Render a Pythonpad component.
        const PythonpadComponent = Vue.extend(VuePythonpadRunner);
        const vm = new PythonpadComponent({
            propsData: {
                locale: 'en',
                initSrc: localStorage.getItem(saveSrcKey) || initSrc,
                initFiles: JSON.parse(localStorage.getItem(saveFilesKey)) || initFiles,
                isFramed: data.fullscreen ? false : true,
                hangerUrl: data.hangerUrl || 'https://www.pythonpad.co/hanger',
                buttons: buttons,
            },
        })

        vm.$on('edit-code', () => {
            store.isSaved = false
        })
        vm.$on('edit-files', () => {
            store.isSaved = false
        })
        vm.$on('save', (save, done, error) => {
            if (save.code) {
                localStorage.setItem(saveSrcKey, save.code)
            }
            if (save.files) {
                localStorage.setItem(saveFilesKey, JSON.stringify(save.files))
            }
            store.isSaved = true
            done()
        })

        vm.$mount(appElement)
        return vm
    }

    return methods.render()
}

export default Pythonpad
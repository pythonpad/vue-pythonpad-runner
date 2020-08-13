
function Pythonpad(element, data) {
    // Add styles.
    const stylesString = `.Pythonpad__app{width:100%;height:100%;}`
    const styleElement = document.createElement('style')
    document.head.appendChild(styleElement)
    styleElement.type = 'text/css'
    styleElement.appendChild(document.createTextNode(stylesString))
    
    // Add the app element.
    const appElement = document.createElement('div')
    appElement.classList.add('Pythonpad__app')
    document.body.appendChild(appElement)

    // Render a Pythonpad component.
    const PythonpadComponent = Vue.extend(VuePythonpadRunner);
    const vm = new PythonpadComponent({
        propsData: {
            locale: 'en',
            brythonStaticUrl: '/node_modules/brython-runner/static',
            staticUrl: '/node_modules/brython-runner/static',
            initSrc: localStorage.getItem('saved-code') || '',
            initFiles: JSON.parse(localStorage.getItem('saved-files')) || {
                'input.txt': {
                    type: 'text',
                    body: 'this file is for test\nhello world',
                },
                'asset.txt': {
                    type: 'text',
                    body: 'how do you do?',
                }
            },
            isFramed: true,
            buttons: [],
        },
    })
    vm.$on('edit-code', () => {
        
    })
    vm.$on('save', () => {
        alert('save')
    })

    // @edit-code="handleEdit"
    // @edit-files="handleEdit"
    // @save="handleSave"
    // @share="handleShare"

    vm.$mount()
    appElement.appendChild(vm.$el)
}

export default Pythonpad
import React from 'react'
import { createRoot } from 'react-dom/client'
import ContentScript from './contentScript'


function init() {
    const appContainer = document.createElement('div')
    if (!appContainer) {
        throw new Error('Could not find app container')
    }
    const shadowRoot = appContainer.attachShadow({ mode: 'open' })
    document.body.appendChild(appContainer)
    const shadowDiv = document.createElement('div')
    shadowRoot.appendChild(shadowDiv)
    const root = createRoot(shadowDiv)
    root.render(<ContentScript />)
}

init();
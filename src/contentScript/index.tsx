import React from 'react'
import { createRoot } from 'react-dom/client'
import ContentScript from './contentScript'

export const renderContentScript = () => {
    const headers = document.querySelectorAll('div');
    headers.forEach(header => {
        const appContainer = document.createElement('div');
        const shadowRoot = appContainer.attachShadow({ mode: 'open' });
        header.parentNode.insertBefore(appContainer, header.nextSibling);
        const shadowDiv = document.createElement('div');
        shadowRoot.appendChild(shadowDiv);
        const root = createRoot(shadowDiv);
        root.render(<ContentScript />);
    });
}

//renderContentScript();
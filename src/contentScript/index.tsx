import React from 'react'
import { createRoot } from 'react-dom/client'
import ContentScript from './contentScript'

export const renderContentScript = () => {
    const headers = document.querySelectorAll('h1');
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'renderContentScript') {
        renderContentScript();
        sendResponse({ message: 'contentScriptRendered' });
        console.log('contentScript.tsx: rendered');
    } else {
        sendResponse({ message: 'unknownMessage' });
    }
});

//renderContentScript();
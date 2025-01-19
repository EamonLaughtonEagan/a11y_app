import React from 'react'
import { createRoot } from 'react-dom/client'
import ContentScript from './contentScript'

const renderContentScript = async () => {

    const elements = document.querySelectorAll('h1, h2');
    console.log('header_elements:', elements)
    
    if (!document.getElementById('app-container')) {
        elements.forEach((element, key) => {
            const appContainer = document.createElement('div');
            appContainer.setAttribute('id', `app-container`);
            const shadowRoot = appContainer.attachShadow({ mode: 'open' });
            element.parentNode.insertBefore(appContainer, element.nextSibling);
            const shadowDiv = document.createElement('div');
            shadowRoot.appendChild(shadowDiv);
            const root = createRoot(shadowDiv);
            root.render(<ContentScript />);
            console.log('Content Script rendered');
        });
    } 
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
    //const storage = await chrome.storage.local.get(`violations_${request.tabId}`)
    if (request.message === 'renderContentScript') {
        await renderContentScript()
        sendResponse({message: 'Content Script Successfully rendered'});
    }
})

export default renderContentScript
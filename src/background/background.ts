
import runAxe from "../contentScript/runAxe";

chrome.runtime.onInstalled.addListener(() => {
    console.log('background.ts: extension installed');
})

const styles = ''

function clearStyles() {
    const elements = document.querySelectorAll('.violation-style-element');
    elements.forEach((element: HTMLElement) => {
        element.classList.remove('violation-style-element');
        element.style.border = '';
        element.style.borderRadius = '';
    });
    const labels = document.querySelectorAll('.violation-style-label');
    labels.forEach((label: HTMLElement) => {
        label.classList.remove('violation-style-label');
        label.style.border = '';
        label.style.borderRadius = '';
        label.style.color = '';
        label.style.position = '';
        label.textContent = '';
    });
    const popups = document.querySelectorAll('.violation-style-popup');
    popups.forEach((popup: HTMLElement) => {
        popup.classList.remove('violation-style-popup');
        popup.style.border = '';
        popup.style.borderRadius = '';
        popup.style.display = 'none';
        popup.style.backgroundColor = '';
        popup.style.padding = '';
        popup.style.zIndex = '';
        popup.style.left = '';
        popup.style.bottom = '';
        popup.style.marginBottom = '';
        popup.textContent = '';
        
    });
};

const scrollToViolation = (index: number) => {
    const element = document.getElementById(`violation-${index}`);
    element.style.border = '2px solid yellow';
    console.log(`Scrolling to violation ${index}`);
    console.log(element);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error(`Element with id 'violation-${index}' not found`);
    }
};



// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log('background.ts: received message', request);
//     if (request.message === 'buttonClicked') {
//         chrome.tabs.query({active: true, currentWindow: true}, tabs => {
//             if (tabs[0].id) {
//                 const tabId = tabs[0].id;
//                 // Inject axe-core library
//                 chrome.scripting.executeScript({
//                     target: { tabId },
//                     func: renderContentScript
//                 })
//             }
//         });
//         return true; // This is required to use sendResponse asynchronously
//     }
// });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background.ts: received message', request);
    if (request.message === 'buttonClicked') {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                // Inject axe-core library
                chrome.scripting.executeScript({
                    target: { tabId },
                    files: ['axe.min.js']
                }, () => {
                    // After the library is injected, run axe
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        func: runAxe,
                        args: [tabId]
                    }, (results) => {
                        sendResponse({violations: results[0].result}); // Send violations
                    });
                });
            }
        });
        return true; // This is required to use sendResponse asynchronously
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'clearViolations') {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: clearStyles
                })
            }
        });
        console.log('Received clearViolations message');
        sendResponse({ success: true });
        return true;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'scrollToViolation') {
        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: scrollToViolation,
                    args: [request.index] // Pass the index as an argument
                })
            }
        });
        console.log('Received scrollToViolation message');
        sendResponse({ success: true });
        return true;
    }
});


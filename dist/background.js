/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.runtime.onInstalled.addListener(() => {
    console.log('background.ts: extension installed');
});
const styles = '';
function runAxe(tabId) {
    return new Promise((resolve, reject) => {
        //@ts-ignore
        axe.run((err, results) => {
            if (err)
                reject(err);
            else {
                const violationsWithNodes = results.violations.map((violation, index) => {
                    return Object.assign(Object.assign({}, violation), { nodes: violation.nodes.map(node => {
                            const element = document.querySelector(node.target);
                            element.id = `violation-${index}`;
                            const elementStyles = {
                                border: '2px solid blue',
                                borderRadius: '8px'
                            };
                            Object.assign(element.style, elementStyles);
                            element.classList.add('violation-style-element');
                            // create label
                            const label = document.createElement('div');
                            label.textContent = (index + 1).toString();
                            const labelStyles = {
                                position: 'absolute',
                                color: 'black',
                                border: '2px solid black',
                                borderRadius: '8px',
                                zIndex: '9999',
                                left: '0'
                            };
                            Object.assign(label.style, labelStyles);
                            label.classList.add('violation-style-label');
                            element.insertBefore(label, element.firstChild);
                            // create popup
                            const popup = document.createElement('div');
                            popup.textContent = violation.description;
                            const popupStyles = {
                                backgroundColor: 'white',
                                border: '1px solid black',
                                padding: '5px',
                                zIndex: '10000',
                                left: '0',
                                bottom: '100%', // Position above the label
                                marginBottom: '20px', // Add some space between label and popup
                                display: 'none'
                            };
                            Object.assign(popup.style, popupStyles);
                            popup.classList.add('violation-style-popup');
                            // Show popup on hover
                            element.addEventListener('mouseenter', () => {
                                popup.style.display = 'block';
                            });
                            element.addEventListener('mouseleave', () => {
                                popup.style.display = 'none';
                            });
                            // insert popup after the label
                            if (label.nextSibling) {
                                element.insertBefore(popup, label.nextSibling);
                            }
                            else {
                                element.appendChild(popup);
                            }
                            return node.target;
                        }) });
                });
                chrome.storage.local.set({ [`violations_${tabId}`]: violationsWithNodes });
                resolve(violationsWithNodes);
            }
        });
    });
}
;
function clearStyles() {
    const elements = document.querySelectorAll('.violation-style-element');
    elements.forEach((element) => {
        element.classList.remove('violation-style-element');
        element.style.border = '';
        element.style.borderRadius = '';
    });
    const labels = document.querySelectorAll('.violation-style-label');
    labels.forEach((label) => {
        label.classList.remove('violation-style-label');
        label.style.border = '';
        label.style.borderRadius = '';
        label.style.color = '';
        label.style.position = '';
        label.textContent = '';
    });
    const popups = document.querySelectorAll('.violation-style-popup');
    popups.forEach((popup) => {
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
}
;
const scrollToViolation = (index) => {
    const element = document.getElementById(`violation-${index}`);
    element.style.border = '2px solid yellow';
    console.log(`Scrolling to violation ${index}`);
    console.log(element);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    else {
        console.error(`Element with id 'violation-${index}' not found`);
    }
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background.ts: received message', request);
    if (request.message === 'buttonClicked') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
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
                        sendResponse({ violations: results[0].result }); // Send violations
                    });
                });
            }
        });
        return true; // This is required to use sendResponse asynchronously
    }
    else if (request.message === 'clearViolations') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: clearStyles
                });
            }
        });
        return true;
    }
    else if (request.message === 'scrollToViolation') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: scrollToViolation,
                    args: [request.index] // Pass the index as an argument
                });
            }
        });
        return true;
    }
});

/******/ })()
;
//# sourceMappingURL=background.js.map
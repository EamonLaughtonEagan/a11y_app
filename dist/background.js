/******/ (() => { // webpackBootstrap
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.runtime.onInstalled.addListener(() => {
    console.log('background.js');
});
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
                            element.style.border = '2px solid red';
                            element.style.borderRadius = '8px';
                            element.classList.add('violation-style-element');
                            // create label
                            const label = document.createElement('div');
                            label.textContent = (index + 1).toString();
                            label.style.position = 'absolute';
                            label.style.color = 'black';
                            label.style.border = '2px solid black';
                            label.style.borderRadius = '8px';
                            label.style.zIndex = '9999';
                            label.style.left = '0';
                            label.classList.add('violation-style-label');
                            element.insertBefore(label, element.firstChild);
                            // create popup
                            const popup = document.createElement('div');
                            popup.textContent = violation.description;
                            //popup.style.position = 'absolute';
                            popup.style.backgroundColor = 'white';
                            popup.style.border = '1px solid black';
                            popup.style.padding = '5px';
                            popup.style.zIndex = '10000';
                            popup.style.left = '0';
                            popup.style.bottom = '100%'; // Position above the label
                            popup.style.marginBottom = '20px'; // Add some space between label and popup
                            popup.style.display = 'none';
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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
});

/******/ })()
;
//# sourceMappingURL=background.js.map
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/contentScript/runAxe.tsx":
/*!**************************************!*\
  !*** ./src/contentScript/runAxe.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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
                                border: '2px solid purple',
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (runAxe);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _contentScript_runAxe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contentScript/runAxe */ "./src/contentScript/runAxe.tsx");

chrome.runtime.onInstalled.addListener(() => {
    console.log('background.ts: extension installed');
});
const styles = '';
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
                        func: _contentScript_runAxe__WEBPACK_IMPORTED_MODULE_0__["default"],
                        args: [tabId]
                    }, (results) => {
                        sendResponse({ violations: results[0].result }); // Send violations
                    });
                });
            }
        });
        return true; // This is required to use sendResponse asynchronously
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'clearViolations') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: clearStyles
                });
            }
        });
        console.log('Received clearViolations message');
        sendResponse({ success: true });
        return true;
    }
});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'scrollToViolation') {
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
        console.log('Received scrollToViolation message');
        sendResponse({ success: true });
        return true;
    }
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map
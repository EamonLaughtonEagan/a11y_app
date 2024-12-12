/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/background.ts":
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _contentScript__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../contentScript */ "./src/contentScript/index.tsx");
/* harmony import */ var _contentScript_runAxe__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../contentScript/runAxe */ "./src/contentScript/runAxe.tsx");


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
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('background.ts: received message', request);
    if (request.message === 'buttonClicked') {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs[0].id) {
                const tabId = tabs[0].id;
                // Inject axe-core library
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: _contentScript__WEBPACK_IMPORTED_MODULE_0__.renderContentScript
                });
            }
        });
        return true; // This is required to use sendResponse asynchronously
    }
});
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
                        func: _contentScript_runAxe__WEBPACK_IMPORTED_MODULE_1__["default"],
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


/***/ }),

/***/ "./src/contentScript/Modal.tsx":
/*!*************************************!*\
  !*** ./src/contentScript/Modal.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const Modal = ({ isOpen, onClose, children, buttonRef, onMosueEnter, onMouseLeave }) => {
    const [position, setPosition] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({ top: 0, left: 0 });
    const modalRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top - 10, // adjust as needed
                left: rect.left + rect.width / 2,
            });
        }
    }, [isOpen, buttonRef]);
    if (!isOpen)
        return null;
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: { position: 'relative' } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: Object.assign(Object.assign({}, styles.overlay), { top: position.top, left: position.left }), onMouseEnter: onMosueEnter, onMouseLeave: onMouseLeave },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: styles.modal }, children))));
};
const styles = {
    overlay: {
        position: 'absolute',
        transform: 'translate(-50%, -110%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        position: 'relative',
        minWidth: '300px',
    },
    closeButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer',
    },
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);


/***/ }),

/***/ "./src/contentScript/contentScript.tsx":
/*!*********************************************!*\
  !*** ./src/contentScript/contentScript.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Modal */ "./src/contentScript/Modal.tsx");


const ContentScript = () => {
    const [isModalOpen, setIsModalOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [timeoutId, setTimeoutId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const buttonRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const openModal = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
        setIsModalOpen(true);
    };
    const closeModal = () => {
        const id = setTimeout(() => {
            setIsModalOpen(false);
        }, 1000);
        setTimeoutId(id);
    };
    const handleModalMouseEnter = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            setTimeoutId(null);
        }
    };
    const handleModalMouseLeave = () => {
        closeModal();
    };
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { style: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        } },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { style: {
                textAlign: 'center',
            } }, "Hello from ContentScript!!!"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", { onMouseEnter: openModal, onMouseLeave: closeModal }, "Open Modal"),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_Modal__WEBPACK_IMPORTED_MODULE_1__["default"], { isOpen: isModalOpen, onClose: closeModal, buttonRef: buttonRef, onMosueEnter: handleModalMouseEnter, onMouseLeave: handleModalMouseLeave },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, "Modal Content"),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, "This is the content of the modal"))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentScript);


/***/ }),

/***/ "./src/contentScript/index.tsx":
/*!*************************************!*\
  !*** ./src/contentScript/index.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   renderContentScript: () => (/* binding */ renderContentScript)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _contentScript__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./contentScript */ "./src/contentScript/contentScript.tsx");



const renderContentScript = () => {
    const headers = document.querySelectorAll('div');
    headers.forEach(header => {
        const appContainer = document.createElement('div');
        const shadowRoot = appContainer.attachShadow({ mode: 'open' });
        header.parentNode.insertBefore(appContainer, header.nextSibling);
        const shadowDiv = document.createElement('div');
        shadowRoot.appendChild(shadowDiv);
        const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(shadowDiv);
        root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_contentScript__WEBPACK_IMPORTED_MODULE_2__["default"], null));
    });
};
//renderContentScript();


/***/ }),

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
                            // Render ContentScript component
                            // const contentScriptContainer = document.createElement('div');
                            // element.appendChild(contentScriptContainer);
                            // const root = createRoot(contentScriptContainer);
                            // root.render(<ContentScript />);
                            return node;
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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"background": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkboilerplate_react_chrome_extension"] = self["webpackChunkboilerplate_react_chrome_extension"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_react-dom_client_js"], () => (__webpack_require__("./src/background/background.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=background.js.map
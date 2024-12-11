/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/Buttons.tsx":
/*!************************************!*\
  !*** ./src/components/Buttons.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Button: () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};

const Button = (_a) => {
    var { onClick, children, className } = _a, props = __rest(_a, ["onClick", "children", "className"]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", Object.assign({}, props, { onClick: onClick, className: `
                p-2 
                rounded-md 
                border-2 
                bg-white 
                border-gray-300 
                focus:outline-none 
                focus:border-blue-500 
                disabled:bg-gray-200
                ${className} ` }), children));
};


/***/ }),

/***/ "./src/components/Card.tsx":
/*!*********************************!*\
  !*** ./src/components/Card.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_tailwind_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/tailwind.css */ "./src/assets/tailwind.css");


const getImpactColour = (impact) => {
    switch (impact) {
        case 'minor':
            return 'bg-yellow-200';
        case 'moderate':
            return 'bg-orange-200';
        case 'serious':
            return 'bg-red-200';
        case 'critical':
            return 'bg-red-600';
        default:
            return 'bg-gray-200';
    }
};
const handleScrollToViolation = (index) => {
    chrome.runtime.sendMessage({ message: 'scrollToViolation', index: index });
};
const Card = ({ violation, index }) => {
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", { className: 'flex justify-between border-b border-gray-600 py-2' },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex items-start' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", null, index + 1),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'px-2' },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", { className: 'font-bold w-fit cursor-pointer', onClick: () => handleScrollToViolation(index) }, violation.description),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("p", null, violation.help),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("a", { className: 'text-blue-400', href: violation.helpUrl, target: '_blank', rel: 'noopener noreferrer' }, violation.helpUrl))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("h1", { className: `${getImpactColour(violation.impact)} px-2 py-0.5 rounded-md` }, violation.impact))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Card);


/***/ }),

/***/ "./src/components/ChatLog.tsx":
/*!************************************!*\
  !*** ./src/components/ChatLog.tsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

const ChatLog = ({ chatLog, loading }) => {
    const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    };
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        scrollToBottom();
    }, [chatLog]);
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", { className: `space-y-4` },
        chatLog.map((chat, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", { key: index, className: `flex flex-col w-full h-min px-2` },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: `${chat.agent === 'user' ? 'items-end' : 'items-start'} flex flex-col` },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'text-md px-2 font-mono font-bold' }, chat.agent === 'user' ? '' : 'Assistant'),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: `${chat.agent === 'user' ? 'bg-blue-100' : 'bg-gray-100'} w-fit p-2 rounded-2xl border border-gray-300 flex flex-col font-mono` },
                    react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", null, chat.message)))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { ref: messagesEndRef })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatLog);


/***/ }),

/***/ "./src/popup/popup.tsx":
/*!*****************************!*\
  !*** ./src/popup/popup.tsx ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var _assets_tailwind_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/tailwind.css */ "./src/assets/tailwind.css");
/* harmony import */ var _components_Card__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/Card */ "./src/components/Card.tsx");
/* harmony import */ var _util_formatViolations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../util/formatViolations */ "./src/util/formatViolations.ts");
/* harmony import */ var _components_ChatLog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/ChatLog */ "./src/components/ChatLog.tsx");
/* harmony import */ var _components_Buttons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/Buttons */ "./src/components/Buttons.tsx");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







//TODO: Change this to the server's URL
const BASE_URL = 'http://172.105.106.240';
const VIOLATION_URL = `${BASE_URL}/violations`;
const CHAT_URL = `${BASE_URL}/chat`;
const Popup = () => {
    const [violations, setViolations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [chatLog, setChatLog] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
    const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const inputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
    // generating violations logic
    const [generatingViolations, setGeneratingViolations] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [generatingViolationsText, setGeneratingViolationsText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('Generating Violations');
    // Loading Logic
    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [loadingText, setLoadingText] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('Loading');
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        const interval = setInterval(() => {
            if (loading) {
                setLoadingText((prevText) => {
                    if (prevText === 'Loading...')
                        return 'Loading';
                    else if (prevText === 'Loading')
                        return 'Loading.';
                    else if (prevText === 'Loading.')
                        return 'Loading..';
                    else if (prevText === 'Loading..')
                        return 'Loading...';
                });
            }
            if (generatingViolations) {
                setGeneratingViolationsText((prevText) => {
                    if (prevText === 'Generating Violations...')
                        return 'Generating Violations';
                    else if (prevText === 'Generating Violations')
                        return 'Generating Violations.';
                    else if (prevText === 'Generating Violations.')
                        return 'Generating Violations..';
                    else if (prevText === 'Generating Violations..')
                        return 'Generating Violations...';
                });
            }
        }, 200);
        return () => clearInterval(interval);
    }, [loading, generatingViolations]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.get([`violations_${tabId}`, `chatLog_${tabId}`, `violationsGenerated_${tabId}`], function (result) {
                setViolations(result[`violations_${tabId}`] || []);
                setChatLog(result[`chatLog_${tabId}`] || []);
                if (!result[`violationsGenerated_${tabId}`]) {
                    handleGenerateViolations(tabId);
                }
            });
        });
    }, []);
    // save chat log to local storage so it persists between popup reloads
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: chatLog });
        });
    }, [chatLog]);
    const handleGenerateViolations = (tabId) => __awaiter(void 0, void 0, void 0, function* () {
        setGeneratingViolations(true);
        let response = yield chrome.runtime.sendMessage({ message: 'buttonClicked' });
        setGeneratingViolations(false);
        console.log("Violations from background.ts: ", response.violations);
        setViolations(response.violations);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            chrome.storage.local.set({ [`violations_${tabId}`]: response.violations,
                [`violationsGenerated_${tabId}`]: true });
        });
    });
    const handleClearViolations = () => {
        setViolations([]);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`violations_${tabId}`]: [],
                [`violationsGenerated_${tabId}`]: false });
        });
        chrome.runtime.sendMessage({ message: 'clearViolations' });
    };
    const updateChatLog = (url, message, agent) => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        const newChatLog = [...chatLog, { message, agent }];
        setChatLog(newChatLog);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: newChatLog });
        });
        const response = yield fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chatLog: newChatLog
            })
        });
        const data = yield response.json();
        const updatedChatLog = [...newChatLog, { message: data.message, agent: 'agent' }];
        setChatLog(updatedChatLog);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: updatedChatLog });
        });
        setLoading(false);
    });
    const handleClearChatLog = () => {
        setChatLog([]);
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            chrome.storage.local.set({ [`chatLog_${tabId}`]: [] });
        });
    };
    const handleGenerateViolationsButtonClick = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            const tabId = tabs[0].id;
            handleClearViolations();
            handleGenerateViolations(tabId);
        });
    };
    const getSuggestions = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        const descriptions = (0,_util_formatViolations__WEBPACK_IMPORTED_MODULE_4__["default"])(violations);
        yield updateChatLog(VIOLATION_URL, descriptions, 'Violation(s)');
    });
    const handleSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.focus();
        }
        const message = input.trim();
        setInput('');
        yield updateChatLog(CHAT_URL, message, 'user');
    });
    return (react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex flex-col w-full h-screen' },
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("nav", { className: 'fixed top-0 left-0 right-0 flex justify-around items-center p-4 bg-gray-900 text-black shadow-md' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex space-x-1' },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Buttons__WEBPACK_IMPORTED_MODULE_6__.Button, { onClick: handleGenerateViolationsButtonClick, className: 'px-4 bg-gray-400 hover:bg-gray-500 rounded' }, "Regenerate Violations"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Buttons__WEBPACK_IMPORTED_MODULE_6__.Button, { onClick: handleClearViolations, className: 'px-4 bg-gray-400 hover:bg-gray-500 rounded' }, "Clear Violations"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Buttons__WEBPACK_IMPORTED_MODULE_6__.Button, { onClick: getSuggestions, disabled: violations.length === 0, className: 'px-4 bg-gray-500 hover:bg-green-700 rounded' }, "Get Suggestions"),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Buttons__WEBPACK_IMPORTED_MODULE_6__.Button, { onClick: handleClearChatLog, className: 'px-4 bg-gray-400 hover:bg-gray-500 rounded' }, "Reset Chat"))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'mt-24 mb-4' }, generatingViolations ? react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'flex items-center justify-center space-x-2' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("svg", { className: 'animate-spin h-5 w-5 text-blue-500', xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24' },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("circle", { className: 'opacity-25', cx: '12', cy: '12', r: '10', stroke: 'currentColor', strokeWidth: '4' }),
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("path", { className: 'opacity-75', fill: 'currentColor', d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' })),
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("span", { className: 'text-lg font-medium text-gray-700' }, generatingViolationsText)) :
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", { className: 'px-2' }, violations.map((violation, index) => (react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_Card__WEBPACK_IMPORTED_MODULE_3__["default"], { key: index, violation: violation, index: index }))))),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_ChatLog__WEBPACK_IMPORTED_MODULE_5__["default"], { chatLog: chatLog, loading: loading }),
        react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", { className: 'sticky bottom-0 left-0 right-0 justify-center items-center flex h-12' },
            react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", { onSubmit: handleSubmit, className: 'flex justify-center w-full' },
                react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", { ref: inputRef, className: '\n                            w-3/4\n                            mx-auto\n                            p-2\n                            rounded-md \n                            border-2 \n                            border-gray-300 \n                            focus:outline-none \n                            focus:border-blue-500\n                            disabled:bg-white\n                            font-size-lg\n                        ', value: input, onChange: (e) => setInput(e.target.value), placeholder: `${loading ? loadingText : 'Talk with your assistant...'}`, disabled: loading })))));
};
const container = document.createElement('div');
document.body.appendChild(container);
const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
root.render(react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Popup, null));


/***/ }),

/***/ "./src/util/formatViolations.ts":
/*!**************************************!*\
  !*** ./src/util/formatViolations.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const formatViolations = (violations) => {
    return 'Here are the violations I found on the page... ' + violations.map((item, index) => `${index + 1}: ${item.description}`).join(', ');
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatViolations);


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
/******/ 			"popup": 0
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
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_css-loader_dist_runtime_api_js-node_modules_css-loader_dist_runtime_sour-b53f7e","src_assets_tailwind_css"], () => (__webpack_require__("./src/popup/popup.tsx")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=popup.js.map
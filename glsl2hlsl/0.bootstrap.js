(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ "../pkg/glsl2hlsl_wasm.js":
/*!********************************!*\
  !*** ../pkg/glsl2hlsl_wasm.js ***!
  \********************************/
/*! exports provided: transpile, download, __wbg_downloadfile_759000e02a450362, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./glsl2hlsl_wasm_bg.wasm */ \"../pkg/glsl2hlsl_wasm_bg.wasm\");\n/* harmony import */ var _glsl2hlsl_wasm_bg_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glsl2hlsl_wasm_bg.js */ \"../pkg/glsl2hlsl_wasm_bg.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"transpile\", function() { return _glsl2hlsl_wasm_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"transpile\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"download\", function() { return _glsl2hlsl_wasm_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"download\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbg_downloadfile_759000e02a450362\", function() { return _glsl2hlsl_wasm_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbg_downloadfile_759000e02a450362\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return _glsl2hlsl_wasm_bg_js__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_throw\"]; });\n\n\n\n\n//# sourceURL=webpack:///../pkg/glsl2hlsl_wasm.js?");

/***/ }),

/***/ "../pkg/glsl2hlsl_wasm_bg.js":
/*!***********************************!*\
  !*** ../pkg/glsl2hlsl_wasm_bg.js ***!
  \***********************************/
/*! exports provided: transpile, download, __wbg_downloadfile_759000e02a450362, __wbindgen_throw */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* WEBPACK VAR INJECTION */(function(module) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"transpile\", function() { return transpile; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"download\", function() { return download; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbg_downloadfile_759000e02a450362\", function() { return __wbg_downloadfile_759000e02a450362; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__wbindgen_throw\", function() { return __wbindgen_throw; });\n/* harmony import */ var _snippets_glsl2hlsl_wasm_684981afa12c8924_www_file_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./snippets/glsl2hlsl-wasm-684981afa12c8924/www/file.js */ \"../pkg/snippets/glsl2hlsl-wasm-684981afa12c8924/www/file.js\");\n/* harmony import */ var _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./glsl2hlsl_wasm_bg.wasm */ \"../pkg/glsl2hlsl_wasm_bg.wasm\");\n\n\n\nconst lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;\n\nlet cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });\n\ncachedTextDecoder.decode();\n\nlet cachegetUint8Memory0 = null;\nfunction getUint8Memory0() {\n    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer) {\n        cachegetUint8Memory0 = new Uint8Array(_glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer);\n    }\n    return cachegetUint8Memory0;\n}\n\nfunction getStringFromWasm0(ptr, len) {\n    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));\n}\n\nlet WASM_VECTOR_LEN = 0;\n\nconst lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;\n\nlet cachedTextEncoder = new lTextEncoder('utf-8');\n\nconst encodeString = (typeof cachedTextEncoder.encodeInto === 'function'\n    ? function (arg, view) {\n    return cachedTextEncoder.encodeInto(arg, view);\n}\n    : function (arg, view) {\n    const buf = cachedTextEncoder.encode(arg);\n    view.set(buf);\n    return {\n        read: arg.length,\n        written: buf.length\n    };\n});\n\nfunction passStringToWasm0(arg, malloc, realloc) {\n\n    if (realloc === undefined) {\n        const buf = cachedTextEncoder.encode(arg);\n        const ptr = malloc(buf.length);\n        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);\n        WASM_VECTOR_LEN = buf.length;\n        return ptr;\n    }\n\n    let len = arg.length;\n    let ptr = malloc(len);\n\n    const mem = getUint8Memory0();\n\n    let offset = 0;\n\n    for (; offset < len; offset++) {\n        const code = arg.charCodeAt(offset);\n        if (code > 0x7F) break;\n        mem[ptr + offset] = code;\n    }\n\n    if (offset !== len) {\n        if (offset !== 0) {\n            arg = arg.slice(offset);\n        }\n        ptr = realloc(ptr, len, len = offset + arg.length * 3);\n        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);\n        const ret = encodeString(arg, view);\n\n        offset += ret.written;\n    }\n\n    WASM_VECTOR_LEN = offset;\n    return ptr;\n}\n\nlet cachegetInt32Memory0 = null;\nfunction getInt32Memory0() {\n    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer) {\n        cachegetInt32Memory0 = new Int32Array(_glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"memory\"].buffer);\n    }\n    return cachegetInt32Memory0;\n}\n/**\n* @param {string} input\n* @param {boolean} extract_props\n* @param {boolean} raymarch\n* @returns {string}\n*/\nfunction transpile(input, extract_props, raymarch) {\n    try {\n        const retptr = _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_add_to_stack_pointer\"](-16);\n        var ptr0 = passStringToWasm0(input, _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_malloc\"], _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_realloc\"]);\n        var len0 = WASM_VECTOR_LEN;\n        _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"transpile\"](retptr, ptr0, len0, extract_props, raymarch);\n        var r0 = getInt32Memory0()[retptr / 4 + 0];\n        var r1 = getInt32Memory0()[retptr / 4 + 1];\n        return getStringFromWasm0(r0, r1);\n    } finally {\n        _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_add_to_stack_pointer\"](16);\n        _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_free\"](r0, r1);\n    }\n}\n\n/**\n* @param {string} json\n* @param {boolean} extract_props\n* @param {boolean} raymarch\n*/\nfunction download(json, extract_props, raymarch) {\n    var ptr0 = passStringToWasm0(json, _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_malloc\"], _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"__wbindgen_realloc\"]);\n    var len0 = WASM_VECTOR_LEN;\n    _glsl2hlsl_wasm_bg_wasm__WEBPACK_IMPORTED_MODULE_1__[\"download\"](ptr0, len0, extract_props, raymarch);\n}\n\nfunction __wbg_downloadfile_759000e02a450362(arg0, arg1, arg2, arg3) {\n    Object(_snippets_glsl2hlsl_wasm_684981afa12c8924_www_file_js__WEBPACK_IMPORTED_MODULE_0__[\"download_file\"])(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));\n};\n\nfunction __wbindgen_throw(arg0, arg1) {\n    throw new Error(getStringFromWasm0(arg0, arg1));\n};\n\n\n/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../www/node_modules/webpack/buildin/harmony-module.js */ \"./node_modules/webpack/buildin/harmony-module.js\")(module)))\n\n//# sourceURL=webpack:///../pkg/glsl2hlsl_wasm_bg.js?");

/***/ }),

/***/ "../pkg/glsl2hlsl_wasm_bg.wasm":
/*!*************************************!*\
  !*** ../pkg/glsl2hlsl_wasm_bg.wasm ***!
  \*************************************/
/*! exports provided: memory, transpile, download, __wbindgen_add_to_stack_pointer, __wbindgen_malloc, __wbindgen_realloc, __wbindgen_free */
/***/ (function(module, exports, __webpack_require__) {

eval("\"use strict\";\n// Instantiate WebAssembly module\nvar wasmExports = __webpack_require__.w[module.i];\n__webpack_require__.r(exports);\n// export exports from WebAssembly module\nfor(var name in wasmExports) if(name != \"__webpack_init__\") exports[name] = wasmExports[name];\n// exec imports from WebAssembly module (for esm order)\n/* harmony import */ var m0 = __webpack_require__(/*! ./glsl2hlsl_wasm_bg.js */ \"../pkg/glsl2hlsl_wasm_bg.js\");\n\n\n// exec wasm module\nwasmExports[\"__webpack_init__\"]()\n\n//# sourceURL=webpack:///../pkg/glsl2hlsl_wasm_bg.wasm?");

/***/ }),

/***/ "../pkg/snippets/glsl2hlsl-wasm-684981afa12c8924/www/file.js":
/*!*******************************************************************!*\
  !*** ../pkg/snippets/glsl2hlsl-wasm-684981afa12c8924/www/file.js ***!
  \*******************************************************************/
/*! exports provided: download_file */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"download_file\", function() { return download_file; });\n// Text write\nvar textFile = null,\nmakeTextFile = function (text) {\n    var data = new Blob([text], {type: 'text/plain'});\n\n    if (textFile !== null) {\n        window.URL.revokeObjectURL(textFile);\n    }\n\n    textFile = window.URL.createObjectURL(data);\n\n    return textFile;\n};\n\n// Set up downloading\nfunction download_file(name, contents) {\n    const a = document.createElement(\"a\");\n    a.style.display = \"none\";\n    a.href = makeTextFile(contents);\n    a.download = name;\n    document.body.appendChild(a);\n    a.click();\n}\n\n//# sourceURL=webpack:///../pkg/snippets/glsl2hlsl-wasm-684981afa12c8924/www/file.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var glsl2hlsl_wasm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! glsl2hlsl-wasm */ \"../pkg/glsl2hlsl_wasm.js\");\n\n\nlet inp = document.getElementById(\"in\");\nlet outp = document.getElementById(\"out\");\n\nlet shader = document.getElementById(\"shader\");\n\nlet raymarch = document.getElementById(\"raymarch\");\nlet extract = document.getElementById(\"extract\");\n\ndocument.getElementById(\"convert\").addEventListener(\"click\", function (e) { \n    outp.value = glsl2hlsl_wasm__WEBPACK_IMPORTED_MODULE_0__[\"transpile\"](inp.value, extract.checked, raymarch.checked);\n});\n\ndocument.getElementById(\"download\").addEventListener(\"click\", function (e) {\n\n    var arr = shader.value.split(\"/\").filter(x => x.length > 0);\n\n    const xhttp = new XMLHttpRequest();\n    xhttp.onload = function() {\n        glsl2hlsl_wasm__WEBPACK_IMPORTED_MODULE_0__[\"download\"](this.responseText, extract.checked, raymarch.checked);\n    }\n    \n    xhttp.open(\"GET\", \"https://www.shadertoy.com/api/v1/shaders/\" + arr[arr.length-1] + \"?key=NtHtMm\");\n    xhttp.send();\n});\n\n//# sourceURL=webpack:///./index.js?");

/***/ }),

/***/ "./node_modules/webpack/buildin/harmony-module.js":
/*!*******************************************!*\
  !*** (webpack)/buildin/harmony-module.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = function(originalModule) {\n\tif (!originalModule.webpackPolyfill) {\n\t\tvar module = Object.create(originalModule);\n\t\t// module.parent = undefined by default\n\t\tif (!module.children) module.children = [];\n\t\tObject.defineProperty(module, \"loaded\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.l;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"id\", {\n\t\t\tenumerable: true,\n\t\t\tget: function() {\n\t\t\t\treturn module.i;\n\t\t\t}\n\t\t});\n\t\tObject.defineProperty(module, \"exports\", {\n\t\t\tenumerable: true\n\t\t});\n\t\tmodule.webpackPolyfill = 1;\n\t}\n\treturn module;\n};\n\n\n//# sourceURL=webpack:///(webpack)/buildin/harmony-module.js?");

/***/ })

}]);
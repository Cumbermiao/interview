(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./app/Greeter.js":
/*!************************!*\
  !*** ./app/Greeter.js ***!
  \************************/
/*! exports provided: default, a, b */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return a; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return b; });
/* harmony default export */ __webpack_exports__["default"] = (function () {
  var greet = document.createElement('div');
  greet.textContent = "Hi there and greetings!";
  return greet;
});

const a= 10;
const b= function(){return 11}

/***/ }),

/***/ "./app/main.js":
/*!*********************!*\
  !*** ./app/main.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Greeter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Greeter */ "./app/Greeter.js");
// const greeter = require('./Greeter.js');

console.log(_Greeter__WEBPACK_IMPORTED_MODULE_0__["default"])
document.querySelector("#root").appendChild(Object(_Greeter__WEBPACK_IMPORTED_MODULE_0__["default"])());

__webpack_require__(/*! ./test */ "./app/test.js");

/***/ }),

/***/ "./app/test.js":
/*!*********************!*\
  !*** ./app/test.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var name = 'test';
var age = 10;
console.log(name,age)
module.exports = {
  name,
  age
}

/***/ })

},[["./app/main.js","mainfest"]]]);
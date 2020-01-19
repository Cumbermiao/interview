(function(modules){
    const installedModules = {};

    function require(moduleId){
      if(installedModules[moduleId]){
        return installedModules[moduleId].exports
      }

      var module = (installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      })

      console.log(moduleId,modules[moduleId])

      // modules[moduleId].call(
      //   module.exports,
      //   module,
      //   module.exports,
      //   require
      // )
      modules[moduleId](module.exports,require)
    }
    require("0")
  })({"0":(function (exports,require){
    "use strict";

var _plus = require("F:\\code\\interview\\07.minipack\\source\\plus.js");

var initCount = 1;
var fiberArr = [1, 1];
debugger;

for (var i = 2; i < 20; i++) {
  fiberArr[i] = (0, _plus.plus)(fiberArr[i - 1], fiberArr[i - 2]);
}

console.log(fiberArr);
  }),"1":(function (exports,require){
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _minus = _interopRequireDefault(require("F:\\code\\interview\\07.minipack\\source\\minus.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var plus = function plus(num1, num2) {
  return num1 + num2;
};

var plusOne = function plusOne(num) {
  return num + 1;
};

var minusOne = function minusOne(num) {
  return (0, _minus["default"])(num, 1);
};

var _default = {
  plus: plus,
  plusOne: plusOne,
  minusOne: minusOne
};
exports["default"] = _default;
  }),"2":(function (exports,require){
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

function _default(a, b) {
  return a - b;
}
  })})
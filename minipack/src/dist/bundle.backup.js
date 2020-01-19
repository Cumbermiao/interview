(function (modules) {
  console.log(modules)
  function require(moduleId) {
      let module = {
        exports:{}
      };
      console.log(moduleId)
      console.log(modules[moduleId])
      modules[moduleId](module, module.exports, require);
      return module.exports;
  }
  require("F:\\code\\interview\\minipack\\source\\main.js")
})({"F:\\code\\interview\\minipack\\source\\main.js":function (module, exports, require) {
  "use strict";

var _plus = require("F:\\code\\interview\\minipack\\source\\plus.js");

var initCount = 1;
var fiberArr = [1, 1];
debugger;

for (var i = 2; i < 20; i++) {
fiberArr[i] = (0, _plus.plus)(fiberArr[i - 1], fiberArr[i - 2]);
}

console.log(fiberArr);
},"F:\\code\\interview\\minipack\\source\\plus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports.minusOne = exports.plusOne = exports.plus = void 0;

var _minus = _interopRequireDefault(require("F:\\code\\interview\\minipack\\source\\minus.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var plus = function plus(num1, num2) {
return num1 + num2;
};

exports.plus = plus;

var plusOne = function plusOne(num) {
return num + 1;
};

exports.plusOne = plusOne;

var minusOne = function minusOne(num) {
return (0, _minus["default"])(num, 1);
};

exports.minusOne = minusOne;
},"F:\\code\\interview\\minipack\\source\\minus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = _default;

function _default(a, b) {
return a - b;
}
},"F:\\code\\interview\\minipack\\source\\minus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = _default;

function _default(a, b) {
return a - b;
}
},"F:\\code\\interview\\minipack\\source\\plus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports.minusOne = exports.plusOne = exports.plus = void 0;

var _minus = _interopRequireDefault(require("F:\\code\\interview\\minipack\\source\\minus.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var plus = function plus(num1, num2) {
return num1 + num2;
};

exports.plus = plus;

var plusOne = function plusOne(num) {
return num + 1;
};

exports.plusOne = plusOne;

var minusOne = function minusOne(num) {
return (0, _minus["default"])(num, 1);
};

exports.minusOne = minusOne;
},"F:\\code\\interview\\minipack\\source\\minus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = _default;

function _default(a, b) {
return a - b;
}
},"F:\\code\\interview\\minipack\\source\\minus.js":function (module, exports, require) {
  "use strict";

Object.defineProperty(exports, "__esModule", {
value: true
});
exports["default"] = _default;

function _default(a, b) {
return a - b;
}
}})
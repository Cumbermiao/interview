### webpack 生成文件结构分析

```js
(function(modules) {
  //code
})({ modulesObj });
```

modulesObj 结构为

```js
{
  path1:function(module, exports, __webpack__require){
    //code
  },
  path2:function(module, exports, __webpack__require){
    //code
  },
}
```

path 对应着文件的路径， 函数里面主要为文件的内容。

### **webpack_require**(moduleId)

return module.exports

- &.m = modules : expose the modules object (**webpack_modules**)
- &.c = installedModules : expose the module cache
- &.d : define getter function for harmony exports
- &.r : define \_\_esModule on exports
- &.t : create a fake namespace object
- &.n : getDefaultExport function for compatibility with non-harmony modules
- &.o : Object.prototype.hasOwnProperty.call
- &.p = "" : **webpack_public_path**

### param

```js
{
  "./app/Greeter.js":function(module,exports){},
  "./app/main.js":function(module,exports,__webpack_require__){
    const greeter = __webpack_require__('./app/Greeter.js')
  }
}
```

使用 esModule

```js
(function(modules) {
  // webpackBootstrap
  // The module cache
  var installedModules = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    // Flag the module as loaded
    module.l = true;

    // Return the exports of the module
    return module.exports;
  }

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  // create a fake namespace object
  // mode & 1: value is a module id, require it
  // mode & 2: merge all properties of value into the ns
  // mode & 4: return value when already ns object
  // mode & 8|1: behave like require
  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if (mode & 4 && typeof value === 'object' && value && value.__esModule)
      return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value != 'string')
      for (var key in value)
        __webpack_require__.d(
          ns,
          key,
          function(key) {
            return value[key];
          }.bind(null, key)
        );
    return ns;
  };

  // getDefaultExport function for compatibility with non-harmony modules
  __webpack_require__.n = function(module) {
    var getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default'];
          }
        : function getModuleExports() {
            return module;
          };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  // Object.prototype.hasOwnProperty.call
  __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };

  // __webpack_public_path__
  __webpack_require__.p = '';

  // Load entry module and return exports
  return __webpack_require__((__webpack_require__.s = './app/main.js'));
})(
  {
    './app/Greeter.js':function(module, __webpack_exports__, __webpack_require__) {
        'use strict';
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(
          __webpack_exports__,
          'greet',
          function() {
            return greet;
          }
        );
        const greet = function() {
          var greet = document.createElement('div');
          greet.textContent = 'Hi there and greetings!';
          return greet;
        };
      },

    './app/main.js': function(
      module,
      __webpack_exports__,
      __webpack_require__
    ) {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      var _Greeter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        /*! ./Greeter */ './app/Greeter.js'
      );
      // const greeter = require('./Greeter.js');

      console.log(_Greeter__WEBPACK_IMPORTED_MODULE_0__['default']);
      document
        .querySelector('#root')
        .appendChild(
          Object(_Greeter__WEBPACK_IMPORTED_MODULE_0__['default'])()
        );

      __webpack_require__(/*! ./test */ './app/test.js');
    },

    './app/test.js': function(module, exports) {
      var name = 'test';
      var age = 10;
      console.log(name, age);
    }
  }
);
```


整体流程：
1. (function(modules){return __webpack_require__s.='entry.js'})({
  'main.js':function(){},
  'Greeter.js':function(){},
  'test.js':function(){}
})

生成 文件模块对象， 从入口文件开始执行代码并加载中间所需要的文件模块。

2. __webpack_require__(){} 使用 installedModules 缓存加载过的模块， 遇到未加载的模块从 modules 模块对象中加载。

3. 遇到使用 esModule 的文件， 使用 __webpack_require__.d 加载代码块。
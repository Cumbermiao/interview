## 总结
在看了源码之后发现里面的函数关系以及参数还是较为复杂的，有些代码虽然看了但是可能也无法明白里面的妙用，毕竟自己没用动手也没有遇到相关的问题。
下面就简单总结一下相关api实现的总体思路。

## Provider 组件
Provider 继承了 Component 的原型, 这里可以参考扩展的组件如何使用函数创建类组件。
Provider 将 props.store 放入到 state 当中，state 中还放入了 subscription ， 在 render 时通过 context 传递 state 。

## mapStateToProps, mapDispatchToProps
mapStateToProps = (state,ownProps)=>({a:state.a});
mapDispatchToProps = (dispatch,ownProps)=>({b:()=>dispatch(action)});
上面是这两个api的语法， 组件中如何接收到的 props 其实就是执行函数之后的返回值， 最主要的是 connect 中传递对应的参数， 最后将 props 合并之后传递给组件。

这两个函数所使用的是 defaultMapStateToPropsFactories。
下面看一下 mapStateToProps 是如何变成 props 对象的流程。

首先看一下 connect 中的处理
```js
var initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
```

再来看看 match 的代码
```js
function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function (dispatch, options) {
    throw new Error("Invalid value of type " + typeof arg + " for " + name + " argument when connecting component " + options.wrappedComponentName + ".");
  };
}
```
match 使用 factory 执行 mapStateToProps , 那么 wrapMapToPropsFunc 返回的应该也是一个函数， 且接收参数 mapStateToProps , 还有一个 methodName 使用来区分是 mapToDispatchToProps 还是 mapStateToProps 。 

整个 mapStateToProps 和 mapDispatchToProps 的生成对象最终到   initMapStateToProps 和 initMapDispatchToProps 属性上， 最终怎么注入到组件中并没有看到， 不知道是不是 react 里面会主动处理这个 init属性。
而且还有一个问题就是本来以为 initMapStateToProps 应该是一个对象， 结果发现返回的是一个函数， 即 wrapMapToPropsFunc 返回的函数， 而且该函数中的 proxy 逻辑还比较奇怪。


用到了 mapStateToPropsFactories ， 这里 mapStateToPropsFactories 我们使用 defaultMapStateToPropsFactories。下面是 defaultMapStateToPropsFactories 的源码。
```js
export function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}
export function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}
export default [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];
```
我们关注一下 mapStateToProps 为函数时的情况， 用到了 wrapMapToPropsFunc。
```js
export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps


    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== 'production') verifyPlainObject(props, displayName, methodName);
      return props;
    };

    return proxy;
  };
}
```
上面的 proxy 看起来特别的绕。
mapToPropsProxy 函数执行时调用了 proxy.mapToProps 方法， 返回 mapToProps 的结果 。 mapToProps 函数最后返回的应该是一个对象即 props ， 整个函数中不知道 proxy 什么时候执行。 而整个 initProxySelector 返回的就是 proxy ， 推测 initProxySelector 执行后返回 proxy ， proxy 再执行才会返回 props 对象。
至于怎么执行，这个可能就要到 react 源码中查看对于 initMapStateToProps 的处理了。

## connect(mapStateToProps?, mapDispatchToProps?, mergeProps?, options?)
1. mapStateToProps?: Function
2. mapDispatchToProps?: Function | Object
3. mergeProps?: Function
4. options?: Object

connect 是 react-redux 最为重要的 api ， 其实现的代码也是最为核心的，最为复杂的。
先简要走一下 connect 实现的流程。
1. createConnect()=>return function connect
2. connect()=>return connectAdvanced()
3. connectAdvanced()=> return function wrapWithConnect
4. connect()()= wrapWithConnect() => return component
第四部中返回的 component 有好几种， 具体返回根据源码中的条件而定。


connect 相关源码

```js
function createConnect(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$connectHOC = _ref.connectHOC,
    connectHOC = _ref$connectHOC === void 0 ? connectAdvanced : _ref$connectHOC,
    _ref$mapStateToPropsF = _ref.mapStateToPropsFactories,
    mapStateToPropsFactories =
      _ref$mapStateToPropsF === void 0
        ? defaultMapStateToPropsFactories
        : _ref$mapStateToPropsF,
    _ref$mapDispatchToPro = _ref.mapDispatchToPropsFactories,
    mapDispatchToPropsFactories =
      _ref$mapDispatchToPro === void 0
        ? defaultMapDispatchToPropsFactories
        : _ref$mapDispatchToPro,
    _ref$mergePropsFactor = _ref.mergePropsFactories,
    mergePropsFactories =
      _ref$mergePropsFactor === void 0
        ? defaultMergePropsFactories
        : _ref$mergePropsFactor,
    _ref$selectorFactory = _ref.selectorFactory,
    selectorFactory =
      _ref$selectorFactory === void 0
        ? finalPropsSelectorFactory
        : _ref$selectorFactory;

  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    _ref2
  ) {
    if (_ref2 === void 0) {
      _ref2 = {};
    }

    var _ref3 = _ref2,
      _ref3$pure = _ref3.pure,
      pure = _ref3$pure === void 0 ? true : _ref3$pure,
      _ref3$areStatesEqual = _ref3.areStatesEqual,
      areStatesEqual =
        _ref3$areStatesEqual === void 0 ? strictEqual : _ref3$areStatesEqual,
      _ref3$areOwnPropsEqua = _ref3.areOwnPropsEqual,
      areOwnPropsEqual =
        _ref3$areOwnPropsEqua === void 0 ? shallowEqual : _ref3$areOwnPropsEqua,
      _ref3$areStatePropsEq = _ref3.areStatePropsEqual,
      areStatePropsEqual =
        _ref3$areStatePropsEq === void 0 ? shallowEqual : _ref3$areStatePropsEq,
      _ref3$areMergedPropsE = _ref3.areMergedPropsEqual,
      areMergedPropsEqual =
        _ref3$areMergedPropsE === void 0 ? shallowEqual : _ref3$areMergedPropsE,
      extraOptions = _objectWithoutPropertiesLoose(_ref3, [
        'pure',
        'areStatesEqual',
        'areOwnPropsEqual',
        'areStatePropsEqual',
        'areMergedPropsEqual'
      ]);

    var initMapStateToProps = match(
      mapStateToProps,
      mapStateToPropsFactories,
      'mapStateToProps'
    );
    var initMapDispatchToProps = match(
      mapDispatchToProps,
      mapDispatchToPropsFactories,
      'mapDispatchToProps'
    );
    var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    return connectHOC(
      selectorFactory,
      _extends(
        {
          // used in error messages
          methodName: 'connect',
          // used to compute Connect's displayName from the wrapped component's displayName.
          getDisplayName: function getDisplayName(name) {
            return 'Connect(' + name + ')';
          },
          // if mapStateToProps is falsy, the Connect component doesn't subscribe to store state changes
          shouldHandleStateChanges: Boolean(mapStateToProps),
          // passed through to selectorFactory
          initMapStateToProps: initMapStateToProps,
          initMapDispatchToProps: initMapDispatchToProps,
          initMergeProps: initMergeProps,
          pure: pure,
          areStatesEqual: areStatesEqual,
          areOwnPropsEqual: areOwnPropsEqual,
          areStatePropsEqual: areStatePropsEqual,
          areMergedPropsEqual: areMergedPropsEqual
        },
        extraOptions
      )
    );
  };
}

var connect = createConnect();
exports.connect = connect;
```

以上 createConnect 中的参数太多， 我们根据 \_temp 简化下参数。

```js
var _ref = {},
  _ref$connectHOC = undefined,
  connectHOC = connectAdvanced,
  _ref$mapStateToPropsF = undefined,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  _ref$mapDispatchToPro = undefined,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  _ref$mergePropsFactor = undefined,
  mergePropsFactories = defaultMergePropsFactories,
  _ref$selectorFactory = undefined,
  selectorFactory = finalPropsSelectorFactory;
```

createConnect 执行后返回的是一个函数， 我们再来简化下 function connect 里的参数。此处我们不考虑 options 传入的情况， 即 \_ref2 = undefined。

```js
var _ref3 = {},
  _ref3$pure = undefined,
  pure = true,
  _ref3$areStatesEqual = undefined,
  areStatesEqual = strictEqual,
  _ref3$areOwnPropsEqua = undefined,
  areOwnPropsEqual = shallowEqual,
  _ref3$areStatePropsEq = undefined,
  areStatePropsEqual = shallowEqual,
  _ref3$areMergedPropsE = undefined,
  areMergedPropsEqual = shallowEqual,
  extraOptions = _objectWithoutPropertiesLoose(_ref3, [
    'pure',
    'areStatesEqual',
    'areOwnPropsEqual',
    'areStatePropsEqual',
    'areMergedPropsEqual'
  ]);

var initMapStateToProps = match(
  mapStateToProps,
  mapStateToPropsFactories,
  'mapStateToProps'
);
var initMapDispatchToProps = match(
  mapDispatchToProps,
  mapDispatchToPropsFactories,
  'mapDispatchToProps'
);
var initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
```

### void 0

在上面变量声明赋值的时候发现一个现象， 函数中对于未传入的形参其值是 undfined ， 上面对于这种 undefined 形参的判断都是使用 `_ref2 === void 0`。
对于 `void` 运算符， (MDN)[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/void] 上面解释的很清楚， `void expression` 执行 expression 之后返回 undefined 。 `void 0` 用来获取 undefined 原始值。

undefined 原始值？ 看到这个你可能会疑问， undefined 不就是 undefined 吗？ 原始值是什么意思？
实际上， 对于一些老浏览器 `undefined` `window` 都是可以被看做变量赋值的， 例如 `undefined=1` , 此时如果我们使用 undefined 和 undefined 原始值比较就会发生问题，两个实不相等的。

### _objectWithoutPropertiesLoose

```js
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}
```

源码中可以看出 \_objectWithoutPropertiesLoose 功能是生成一个 source 对象中剔除 excluded 中的 key 的对象， 此处我们传入的是 {} ， 返回的也是 {}, 即 extraOptions ={} 。

### match
```js
var initMapStateToProps = match(
  mapStateToProps,
  mapStateToPropsFactories,
  'mapStateToProps'
);
var initMapDispatchToProps = match(
  mapDispatchToProps,
  mapDispatchToPropsFactories,
  'mapDispatchToProps'
);
```
上面代码中 mapStateToProps mapDispatchToProps 都是我们在使用 connect 时传入的参数， 下面看看 match 做了啥。
```js
function match(arg, factories, name) {
  for (var i = factories.length - 1; i >= 0; i--) {
    var result = factories[i](arg);
    if (result) return result;
  }

  return function(dispatch, options) {
    throw new Error(
      'Invalid value of type ' +
        typeof arg +
        ' for ' +
        name +
        ' argument when connecting component ' +
        options.wrappedComponentName +
        '.'
    );
  };
}
```
看到 match 就是将 mapStateToProps 和 mapDispatchToProps 传入到工厂函数中执行了一遍， 最后在把执行结果返回出来。 接下来看看工厂函数。
```js
function whenMapStateToPropsIsFunction(mapStateToProps) {
  return typeof mapStateToProps === 'function' ? wrapMapToPropsFunc(mapStateToProps, 'mapStateToProps') : undefined;
}
function whenMapStateToPropsIsMissing(mapStateToProps) {
  return !mapStateToProps ? wrapMapToPropsConstant(function () {
    return {};
  }) : undefined;
}
var defaultMapStateToPropsFactories = [whenMapStateToPropsIsFunction, whenMapStateToPropsIsMissing];


function whenMapDispatchToPropsIsFunction(mapDispatchToProps) {
  return typeof mapDispatchToProps === 'function' ? wrapMapToPropsFunc(mapDispatchToProps, 'mapDispatchToProps') : undefined;
}
function whenMapDispatchToPropsIsMissing(mapDispatchToProps) {
  return !mapDispatchToProps ? wrapMapToPropsConstant(function (dispatch) {
    return {
      dispatch: dispatch
    };
  }) : undefined;
}
var defaultMapDispatchToPropsFactories = [whenMapDispatchToPropsIsFunction, whenMapDispatchToPropsIsMissing, whenMapDispatchToPropsIsObject];
```
上面是分别处理 mapStateToProps 和 mapDispatchToProps 的所有工厂函数， 里面对形参进行类型判断， 如果类型是函数时返回 wrapMapToPropsFunc 之后的值， 否则返回一个 wrapMapToPropsFunc 处理的一个空函数之后的值。

### wrapMapToPropsFunc
```js
function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps ? proxy.mapToProps(stateOrDispatch, ownProps) : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps


    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch, ownProps) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      verifyPlainObject(props, displayName, methodName);
      return props;
    };

    return proxy;
  };
}
```
wrapMapToPropsFunc 返回的是一个函数 ， 函数返回的是一个 proxy ， proxy 是一个函数， 其有一个 mapToProps 方法 和 dependsOnOwnProps 属性。
在 proxy.mapToProps 函数中， proxy.mapToProps 被改写成 mapStateToProps 或者 mapDispatchToProps。

### finalPropsSelectorFactory
在 connect 函数中 ， 返回的 connectHOC 可以被转换为 `connectAdvanced(finalPropsSelectorFactory,_extends({...}))`
```js
function finalPropsSelectorFactory(dispatch, _ref2) {
  var initMapStateToProps = _ref2.initMapStateToProps,
      initMapDispatchToProps = _ref2.initMapDispatchToProps,
      initMergeProps = _ref2.initMergeProps,
      options = _objectWithoutPropertiesLoose(_ref2, ["initMapStateToProps", "initMapDispatchToProps", "initMergeProps"]);

  var mapStateToProps = initMapStateToProps(dispatch, options);
  var mapDispatchToProps = initMapDispatchToProps(dispatch, options);
  var mergeProps = initMergeProps(dispatch, options);

  {
    verifySubselectors(mapStateToProps, mapDispatchToProps, mergeProps, options.displayName);
  }

  var selectorFactory = options.pure ? pureFinalPropsSelectorFactory : impureFinalPropsSelectorFactory;
  return selectorFactory(mapStateToProps, mapDispatchToProps, mergeProps, dispatch, options);
}

``` 

### connectAdvanced

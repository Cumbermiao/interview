首先我们要清楚 mapToProps 就是 connect 中传入的 mapStateToProps 或者 mapDispatchToProps

```js
import verifyPlainObject from '../utils/verifyPlainObject';
export function wrapMapToPropsConstant(getConstant) {
  return function initConstantSelector(dispatch, options) {
    var constant = getConstant(dispatch, options);

    function constantSelector() {
      return constant;
    }

    constantSelector.dependsOnOwnProps = false;
    return constantSelector;
  };
}

export function getDependsOnOwnProps(mapToProps) {
  //根据 mapToProps 的形参个数判断是否需要传入 ownProps
  return mapToProps.dependsOnOwnProps !== null &&
    mapToProps.dependsOnOwnProps !== undefined
    ? Boolean(mapToProps.dependsOnOwnProps)
    : mapToProps.length !== 1;
}
export function wrapMapToPropsFunc(mapToProps, methodName) {
  return function initProxySelector(dispatch, _ref) {
    var displayName = _ref.displayName;

    var proxy = function mapToPropsProxy(stateOrDispatch, ownProps) {
      return proxy.dependsOnOwnProps
        ? proxy.mapToProps(stateOrDispatch, ownProps)
        : proxy.mapToProps(stateOrDispatch);
    }; // allow detectFactoryAndVerify to get ownProps

    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = function detectFactoryAndVerify(
      stateOrDispatch,
      ownProps
    ) {
      proxy.mapToProps = mapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
      var props = proxy(stateOrDispatch, ownProps);

      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }

      if (process.env.NODE_ENV !== 'production')
        verifyPlainObject(props, displayName, methodName);
      return props;
    };

    return proxy;
  };
}
```

```js
function wrapMapToPropsFunc(paramMapToProps, methodName) {
  return (dispatch, _ref) => {
    var displayName = _ref.displayName;
    var proxy = (stateOrDispatch, ownProps) => {
      if (proxy.dependsOnOwnProps) {
        return proxy.mapToProps(stateOrDispatch, ownprops);
      }
      return proxy.mapToProps(stateOrDispatch);
    };
    proxy.dependsOnOwnProps = true;

    proxy.mapToProps = (stateOrDispatch, ownProps) => {
      proxy.mapToProps = paramMapToProps;
      proxy.dependsOnOwnProps = getDependsOnOwnProps(paramMapToProps);
      var props = proxy(stateOrDispatch, ownProps);
      if (typeof props === 'function') {
        proxy.mapToProps = props;
        proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
        props = proxy(stateOrDispatch, ownProps);
      }
      if (process.env.NODE_ENV !== 'production')
        verifyPlainObject(props, displayName, methodName);
      return props;
    };
  };
}

```

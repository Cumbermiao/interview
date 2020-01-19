Provider 中最主要的就是其构造函数， 里面将 props.store 注入到了 state 当中， 看了(知乎)[https://juejin.im/post/5b8b5a60e51d4538c411ff12#heading-2]上面的分析， 发现上面贴的代码和现在版本的不一样， 代码差异较大。 本示例中， Provider 里还实现了 react 各生命周期的钩子， 添加了一个订阅器 subscription。

在 Provider 构造函数中初始化了一个订阅了 store 的 subscription , ComponentWillMount 中 subscription 监听 store ， 该周期中还判断了当前的 store.state 和 prevState 是否相等， 不相等则 subscription 发出改变信号， 但是没有重新生成一个监听新 store 的subscription， 而在 ComponentDidUpdate 中每次都会生成新的 subscription， 不知道这两个有什么区别。

这里我们来学习下 Provider 是如何基于 Component 封装的。 首先有一个 `_inheritsLoose(Provider, _Component)` , _inheritsLoose 作用是继承 Component , 继承的三个要素 prototype , constructor , __proto__ , 具体代码如下：
```js
function _inheritsLoose(subClass,superClass){
  subClass.prototype = Object.create(superClass.prototype);
  subClass.constructor = subClass;
  subClass.__proto__ = superClass;
}
```

Provider 使用了 Context 来传递 this.state 里的数据， 在子组件中我们从 react-redux 中引入 ReactReduxContext ， `static contextType = ReactReduxContext` 即可以在 this.context 去到 Context.value。
Provider 的 Context.value 中传递了 {store,subscription}。



provider 源码
```js
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/esm/inheritsLoose";
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactReduxContext } from './Context';
import Subscription from '../utils/Subscription';

var Provider =
/*#__PURE__*/
function (_Component) {
  _inheritsLoose(Provider, _Component);

  function Provider(props) {
    var _this;

    _this = _Component.call(this, props) || this;
    var store = props.store;
    _this.notifySubscribers = _this.notifySubscribers.bind(_assertThisInitialized(_this));
    var subscription = new Subscription(store);
    subscription.onStateChange = _this.notifySubscribers;
    _this.state = {
      store: store,
      subscription: subscription
    };
    _this.previousState = store.getState();
    return _this;
  }

  var _proto = Provider.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this._isMounted = true;
    this.state.subscription.trySubscribe();

    if (this.previousState !== this.props.store.getState()) {
      this.state.subscription.notifyNestedSubs();
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    this.state.subscription.tryUnsubscribe();
    this._isMounted = false;
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (this.props.store !== prevProps.store) {
      this.state.subscription.tryUnsubscribe();
      var subscription = new Subscription(this.props.store);
      subscription.onStateChange = this.notifySubscribers;
      this.setState({
        store: this.props.store,
        subscription: subscription
      });
    }
  };

  _proto.notifySubscribers = function notifySubscribers() {
    this.state.subscription.notifyNestedSubs();
  };

  _proto.render = function render() {
    var Context = this.props.context || ReactReduxContext;
    return React.createElement(Context.Provider, {
      value: this.state
    }, this.props.children);
  };

  return Provider;
}(Component);

Provider.propTypes = {
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired
  }),
  context: PropTypes.object,
  children: PropTypes.any
};
export default Provider;
```
## 总结

本次练习主要是针对于 state 的异步更新如何处理。练习的功能也很简单， 首先有一个选择框， 根据选择框选择的内容在请求对应数据并展示， 在请求时无法刷新。

state 设计
```
{
  selectedChannel:'',
  channels:{
    frontend:{
      isFetching:false,
      isOverdue:false,
      lastUpdateTime:''
      data:[]
    },
    reactjs:{
      isFetching:false,
      isOverdue:false,
      lastUpdateTime:''
      data:[]
    }
  }
}
```

### react-thunk
本次实例展示的是 redux 对于异步状态的更新， 使用了 react-thunk 中间件。
正常情况下， dispatch(action) action 是一个普通对象， react-thunk 对 dispatch 进行了扩展， 可以 dispatch 一个函数， dispatch((dispatch,getState,extraArgument)={}) , 该函数中注入了redux原生的 dispatch 方法 和 getState 方法， 所以在 action 函数中你可以继续 dispatch 触发数据更新。 
使用了 react-thunk 之后， 对应的异步请求我们可以封装至 action 中， 无需在UI中请求再在回调中dispatch， 例如
```
//正常异步
const Refresh = function({dispatch}){
  const refresh = ()=>{
    fetch(url)
      .then(res=>res.json())
      .then(json=>dispatch(refreshAction(json)))
  }
  return (<button onClick={()=>refresh()}>refresh</button>)
}


//使用 thunk
const actionCreator = () =>(dispatch,getState)=>{
  dispatch(requestPost());
  fetch(url)
    .then(res=>res.json())
    .then(json=>dispatch(refreshAction(json)))
}

const Refresh = function({dispatch}){
  return (<button onClick={()=>dispatch(actionCreator)}>refresh</button>)
}
```
从上面的例子可以看出区别， 使用了 thunk 之后的异步请求不需要在组件中书写， 直接封装在 action 中。

## 后记

### 在中间件中使用 store.dispatch ?

在 (redux源码分析)[https://cumbermiao.github.io/interview/05.html] 中分析 applyMiddleware 函数的时候， 发现在中间件中是禁止使用 store.dispatch 方法的， 但是在查看官网 (reducing boilerplate)[https://redux.js.org/recipes/reducing-boilerplate] 的 callAPIMiddleware 的代码时发现在该中间件里面直接 dispatch(requestType) ， 下面就来探索一下吧。

首先去掉了 thunk 中间件， 写了一个测试 dispatch 的中间件
```js
//middleware
const canDispatchInMiddleware = ({getState,dispatch}) => next => action =>{
  debugger;
  if(!action.forbiddenDispatch){
    dispatch({...action,forbiddenDispatch:true});
  }
  // return next(action);
} 

//reducer
export default combineReducers({
  selectedChannel,
  channels:postChannel,
  loadPost,
  dispatchInMiddleware:(state='',action)=>{
    switch (action.type){
      case 'dispatchInMiddleware':
        console.log('dispatchInMiddleware');
        return 'can';
      default: return state
    }
  }
})

//component
import {connect} from 'react-redux';
import React, { Component } from 'react';
import {loadPost} from '../actions';
class LoadPost extends Component{
  constructor(props){
    super(props);
  }
  render(){
    const {children, className, onClick, dispatch} = this.props;
    return (
      <div>
        <button onClick={()=>{onClick()}}>LoadPost</button>
        <button onClick={()=>{dispatch({type:'dispatchInMiddleware'})}}>dispatchInMiddleware</button>
      </div>
    )
  }
}

const mapActionToProps = dispatch =>{
  return {
    onClick:()=>{
      dispatch(loadPost())
    },
    dispatch
  }
}

export default connect(null,mapActionToProps)(LoadPost)
```
`action.type='dispatchInMiddleware'`, reducer 执行时输出日志 dispatchInMiddleware , 
LoadPost 组件中可以先忽略 LoadPost ， 现在只需要关注 dispatchInMiddleware 即可。
在实际 debug 中， middleware 中 dispatch 时没有处罚 middlewareAPI 中的 dispatch ， 走的还是未经过封装的 store.dispatch ，会重新走一遍所有的middleware。
```js
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      var store = createStore.apply(void 0, arguments);

      var _dispatch = function dispatch() {
        debugger;
        throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
      };

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch() {
          debugger;
          console.log('in api dispatch')
          return _dispatch.apply(void 0, arguments);
        }
      };
      var chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      console.log(chain)
      _dispatch = compose.apply(void 0, chain)(store.dispatch);
      return _objectSpread2({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
```
在网上看了一下中间件中 dispatch 和 next 的区别， dispatch 会从头走一遍所有的 middleware ， next 直接将 action 传递给下个中间件。 对于 _dispatch 报错的函数还是不知道什么用处。

## TODO:
- [x] actions 完善
- [x] App fetching|empty|refresh|lastUpdate unfinished
- [ ] middlewareAPI中dispatch 报错的函数的作用？
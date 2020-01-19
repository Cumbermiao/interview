## 总结

这个例子是参照 redux 官方案例中的 todos 来写的， 主要功能可以添加 todo, 展示各个状态的 todo并且可以切换 todo 的状态。

state 结构
```
{
  todos: reducer todos,
  visibilityFilter: reducer visibilityFilter
}
```
action 结构
- addToDo : reducer todos
- toggleToDo : reducer todos
- changeFilter : reducer visibilityFilter

例子中还用到了 react-redux 中的 connect 方法， 所有使用 connect 的组件存储在 containers 文件夹中。

`connect(mapStateToProps,mapDispatchToProps)(App)`
connect 接收两个参数， 其中 mapStateToProps 是一个函数， 内置两个参数 state 和 ownProps， 用途是将 Store 中的 state 里的数据使用 props 的方法传入到 App 组件中， 要注意的是此处的 state 是完整的对象，如果要传入指定字段需要自己处理。 ownProps 是 App 本来接收 props属性。
mapDispatchToProps 也是一个函数接， 内置两个参数 dispatch 和 ownProps ， dispatch 就是 Store 的dispatch 方法，ownProps 是 App 本来接收 props属性。一般情况下，用途是将 dispatch 方法封装一层用 props 的方法传递给 App 组件， 因为 dispatch 是 store 的方法， 组件无法获取 dispatch 函数。

在书写过程中需要注意整个数据流， 理清楚 action, reducer, container组件之间的关系， 否则出现问题时需要很长时间定位。 还有对于 action 中的 type 以及 reducer 中根据 type 处理的关系也需要理清楚。

还需要注意的是 mapStateToProps 的返回值必须是一个对象， connect 中会测试 state=undefined 来看你的返回值， 如果不是对象就会报错。
mapDispatchToProps 应该也是一样。

## 疑问
- combineReducer 如何实现
- connect 如何实现
- connect 之后的组件发生的哪些变化
# 观察者模式

## 核心思想

Dep 添加 Sub , data 更新时 Dep 通知 Sub 执行更新， Sub 是 Watcher 实例， Watcher 执行视图更新（改变 nodeValue 或者 value）

## 依赖收集

在 compile template 时， Vue 检测到模板中的变量绑定，执行 new Watcher ，Watcher 实例时会将当前 Watcher 添加到 Dep 中。 对于使用 v-model 的 node 节点， 会监听 input 事件从而改变 data。

## computed 原理

computed 与 data 会建立各自的响应系统， 
computed 初始化时， 会注册一个 watcher 实例， 并在内部实例化一个 Dep 收集依赖。
computed 与 data 类似， 但是 computed 属性自身也可以被添加到其他 computed 属性的依赖中。

## watch 原理

创建一个 watcher 实例， 并将自身添加到 Dep 中， 当状态改变时执行对应回掉函数。
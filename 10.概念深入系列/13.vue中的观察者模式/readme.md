# vue 中的观察者模式

![观察者模式](https://user-gold-cdn.xitu.io/2018/8/26/16575a9afa5a3842?imageslim)



Dep
> 添加订阅者 watcher ， 并在数据改变时通知 watcher
- addSub: 添加订阅者
- notify: 通知订阅者

Watcher
> 实例对应的是绑定了监听数据的元素
- update: 更新数据
- get: 获取最新数据


## Computed & Watch
参考文章:
[Vue.js的computed和watch是如何工作的？](https://juejin.im/post/5b87f13bf265da436479f3c1)
[浅谈 Vue 中 computed 实现原理](https://juejin.im/post/5b98c4da6fb9a05d353c5fd7#heading-1)

### computed 实现原理
1. 当组件初始化的时候，computed 和 data 会分别建立各自的响应系统，Observer遍历 data 中每个属性设置 get/set 数据拦截。

2. 初始化 computed 会调用 initComputed 函数
  - 注册一个 watcher 实例，并在内实例化一个 Dep 消息订阅器用作后续收集依赖（比如渲染函数的 watcher 或者其他观察该计算属性变化的 watcher ）
 - 调用计算属性时会触发其Object.defineProperty的get访问器函数
 - 调用 watcher.depend() 方法向自身的消息订阅器 dep 的 subs 中添加其他属性的 watcher
 - 调用 watcher 的 evaluate 方法（进而调用 watcher 的 get 方法）让自身成为其他 watcher 的消息订阅器的订阅者，首先将 watcher 赋给 Dep.target，然后执行 getter 求值函数，当访问求值函数里面的属性（比如来自 data、props 或其他 computed）时，会同样触发它们的 get 访问器函数从而将该计算属性的 watcher 添加到求值函数中属性的 watcher 的消息订阅器 dep 中，当这些操作完成，最后关闭 Dep.target 赋为 null 并返回求值函数结果。

3. 当某个属性发生变化，触发 set 拦截函数，然后调用自身消息订阅器 dep 的 notify 方法，遍历当前 dep 中保存着所有订阅者 wathcer 的 subs 数组，并逐个调用 watcher 的  update 方法，完成响应更新。

简单来说，当组件初始化时调用 initComputed 方法为 computed 属性创建一个 watcher 实例， 调用 watcher 的 depend 和 evaluate 方法订阅其他 watcher ， 当某个属性发生变化时， 其他 watcher 会通知 computed 属性的 watcher 进行更新。


### watch 原理

watch 方法监听的属性实际上调用的是 Vue.prototype.$watch 方法。
其流程就很简单， 创建一个 watcher 监听对应的属性， 当属性值改变时， 执行对应的回调函数。

```js
 Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      cb.call(vm, watcher.value)
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}

function createWatcher (
  vm: Component,
  expOrFn: string | Function,
  handler: any,
  options?: Object
) {
  if (isPlainObject(handler)) {
    options = handler
    handler = handler.handler
  }
  if (typeof handler === 'string') {
    handler = vm[handler]
  }
  return vm.$watch(expOrFn, handler, options)
}
```
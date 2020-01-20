# React

> React 需要讲下 合成事件、突出 Fiber 这块的重要性， React 使用的是 monorepo(lerna) 的包管理方式。

## React Fiber

> 结合 合作调度模式 & 链表 

### 协程

> 协程的特点在于允许执行被挂起与被恢复，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。

### 合作调度模式

> 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。


## 合成事件
> 参考 [文章](https://juejin.im/post/5d44e3745188255d5861d654#heading-12) 可以结合源码分析

React 自己实现了一套高效的事件注册、存储、分发和重用逻辑的机制， 最大化的解决了 IE 等浏览器的兼容问题。其特点如下：
- 根据 W3C 规范定义，解决各浏览器的差异

- 组件上声明的事件大部分都被绑定到 document 节点上（video、audio）， 优点是简化了 DOM 原生事件， 减少了内存开销

- React 以队列的方式， 从触发事件的组件向上回溯， 调用事件回调函数。 其自己实现了一套事件冒泡机制。

- 使用对象池来管理合成事件对象的创建和销毁， 提高了性能。

- React 干预事件的分发， 不同的事件有不同的优先级

React 事件系统使用插件系统来管理不同行为的事件，插件会处理自己感兴趣的事件类型并生成合成事件对象。 其中 SimpleEventPlugin 用来处理比较通用的事件类型， 如 click、input， ChangeEventPlugin 用来规范表单元素的变动事件。  

在 SimpleEventPlugin 中有三类事件类型：
- DiscreteEvent 离散事件， 并对应 Schedule 中的 UserBlocking 优先级。
- UserBlockingEvent 用户阻塞事件， 对应 UserBlocking 优先级。
- ContinuousEvent 可连续事件， 对应 Immediate 优先级。

React 还抽象出了 react-events 用于封装合成事件，后面可能会把所有的事件都抽到这个包里面。


## 面试解答



### Fiber

> 协程/合作调度模式 -> 出让控制权的实现 -> frame 的执行流程 -> 更多的话可以谈到浏览器的进程和线程

React Fiber 结合协程和合作调度模式的特点， 将更新任务拆分成多个子任务，执行更新任务时通过判断剩余时间出让控制权， 防止执行任务阻塞主线程导致浏览器卡顿。  
出让控制权是借助于 requestIdelCallback , 说是借助 requestIdelCallback 其实 React reconciler 里面通过 requestAnimation 和 message channel 自己实现了 polyfill ，因为其兼容性较差。  

a frame 的执行流程：

Input event callbacks --> requestAnimation --> HTML/CSS parser ---> caculate styles --> reLayout | create layout tree --> update/create layer tree --> paint(include create paint record)  --> composite(交给合成线程并行执行) --> requestIdelCallback


### 合成事件


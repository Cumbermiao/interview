# Fiber

React 框架内部的运作可以分为 3 层：
- Virtual DOM 层，描述页面长什么样。
- Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
- Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

从 React16.8 开始，对 Reconciler 层了做了很大的改动，React 团队也给它起了个新的名字，叫 Fiber Reconciler。这就引入另一个关键词：Fiber。

Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 react 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

为了达到这种效果，就需要有一个调度器 (Scheduler) 来进行任务分配。任务的优先级有六种：
- synchronous，与之前的 Stack Reconciler 操作一样，同步执行
- task，在 next tick 之前执行
- animation，下一帧之前执行
- high，在不久的将来立即执行
- low，稍微延迟执行也没关系
- offscreen，下一次 render 时或 scroll 时才执行

优先级高的任务（如键盘输入）可以打断优先级低的任务（如 Diff）的执行，从而更快的生效。

Fiber Reconciler 在执行过程中，会分为 2 个阶段：render 阶段 和 commit 阶段。

## Render 阶段
Render 阶段包括 render 以前的生命周期。在这个阶段执行过程中会根据任务的优先级，选择执行或者暂停。故可能发生某个生命周期被执行多次的情况。
> Render 阶段可以被打断，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。

## Commit 阶段
Render 之后的生命周期，都属于 commit phase。在这个阶段执行过程中不会被打断，会一直执行到底。

## 创建 FiberRoot
在 ReactDOM.render 中会依次调用以下的方法构建 fiber 树:
- legacyRenderSubtreeIntoContainer
- legacyCreateRootFromDOMContainer
- ReactSyncRoot
- 进入 react-reconciler 库
  - 具体通过 createContainer -> createFiberRoot 创建 fiberRoot。

查看 legacyRenderSubtreeIntoContainer 的实现可以知道在初始化的时候会为 根DOM 节点添加 _reactRootContainer 属性， 值为 FiberRootNode， 初始化时调用 unbatchedUpdates 不进行批处理， 其他情况会滴啊用 updateContainer 进行批处理。

# React Fiber

![fiber前后](https://user-gold-cdn.xitu.io/2019/10/21/16deecd21336ca41?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

之前版本的 React reconcilation 对于更新任务无法中断， 如果更新任务长时间占用主线程则会发生卡顿，无法响应用户交互。  
React 16 对 reconcilation 进行了重构， 将 DOM 更新拆分成一个个小任务， 且每个任务有各自的优先级， 高优先级的任务可以中断低优先级的任务。  


## 协程 & 合作调度模式

### 协程
> 协程的特点在于允许执行被挂起与被恢复，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。

```js
const tasks = []
function * run() {
  let task

  while (task = tasks.shift()) {
    // 🔴 判断是否有高优先级事件需要处理, 有的话让出控制权
    if (hasHighPriorityEvent()) {
      yield
    }

    // 处理完高优先级事件后，恢复函数调用栈，继续执行...
    execute(task)
  }
}
```

### 合作调度模式
> 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。  

合作式调度主要就是用来分配任务的，当有更新任务来的时候，不会马上去做 Diff 操作，而是先把当前的更新送入一个 Update Queue 中，然后交给 Scheduler 去处理，Scheduler 会根据当前主线程的使用情况去处理这次 Update。为了实现这种特性，使用了requestIdelCallbackAPI。

这是一种’契约‘调度，要求我们的程序和浏览器紧密结合，互相信任。由浏览器给我们分配执行时间片(requestIdleCallback)，我们要按照约定在这个时间内执行完毕，并将控制权还给浏览器。


## requestIdelCallback

![renderer process 线程调度](https://note.youdao.com/yws/api/personal/file/9981C9BF2B7741CAB26BB59AE94F097F?method=download&shareKey=d59ea04f63e30e62343b0688891c0785)


## FiberNode
```js
function FiberNode(
  tag: WorkTag,
  pendingProps: mixed,
  key: null | string,
  mode: TypeOfMode,
) {
  // Instance
  this.tag = tag; //定义fiber的类型。它在reconcile算法中用于确定需要完成的工作。如前所述，工作取决于React元素的类型，函数createFiberFromTypeAndProps将React元素映射到相应的fiber节点类型。在我们的应用程序中，ClickCounter组件的属性标记是1，表示ClassComponent，而span元素的属性标记是5，表示Host Component。
  this.key = key; //具有一组children的唯一标识符，可帮助React确定哪些项已更改，已添加或从列表中删除。它与此处描述的React的“list and key”功能有关。
  this.elementType = null; //调试过程中发现该值与 type 一样， 暂不知道具体作用。
  this.type = null; //定义与此fiber关联的功能或类。对于类组件，它指向构造函数；对于DOM元素，它指定HTML tag。可以使用这个字段来理解fiber节点与哪个元素相关。
  this.stateNode = null; //保存对组件的类实例，DOM节点或与fiber节点关联的其他React元素类型的引用。

  // Fiber
  this.return = null; //父节点的 fiberNode
  this.child = null; //子节点的 fiberNode
  this.sibling = null; //兄弟节点的 fiberNode
  this.index = 0;

  this.ref = null; //{current}

  this.pendingProps = pendingProps; //已从React元素中的新数据更新，并且需要应用于子组件或DOM元素的props
  this.memoizedProps = null; //在前一次渲染期间用于创建输出的props
  this.updateQueue = null; //用于状态更新，回调函数，DOM更新的队列
  this.memoizedState = null; //于创建输出的fiber状态。处理更新时，它会反映当前在屏幕上呈现的状态。
  this.dependencies = null;

  this.mode = mode;

  // Effects
  this.effectTag = NoEffect;
  this.nextEffect = null;

  this.firstEffect = null;
  this.lastEffect = null;

  this.expirationTime = NoWork;
  this.childExpirationTime = NoWork;

  this.alternate = null; //current 与 alternate 相互引用
}
```
![fiber 链表](https://user-gold-cdn.xitu.io/2019/10/21/16deecc6db5530be?imageslim)

![fiber 迭代顺序](https://user-gold-cdn.xitu.io/2019/10/21/16deecca7850a24d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

使用链表模拟函数调用栈更为可控，fiber 节点的处理可以随时中断和恢复， 对于处理过程中发生异常的节点， 我们可以根据 return 回溯打印出完整的'节点栈'。

[导图](https://www.processon.com/diagraming/5d9c7ae2e4b00e2b8665fc52)

## Update
```js
export type Update<State> = {
  expirationTime: ExpirationTime, //过期时间与更新任务权重有关
  suspenseConfig: null | SuspenseConfig,

  tag: 0 | 1 | 2 | 3,
  payload: any,
  callback: (() => mixed) | null,

  next: Update<State> | null,
  nextEffect: Update<State> | null,

  //DEV only
  priority?: ReactPriorityLevel,
};
```

### priority
```js
export const ImmediatePriority: ReactPriorityLevel = 99;
export const UserBlockingPriority: ReactPriorityLevel = 98;
export const NormalPriority: ReactPriorityLevel = 97;
export const LowPriority: ReactPriorityLevel = 96;
export const IdlePriority: ReactPriorityLevel = 95;
// NoPriority is the absence of priority. Also React-only.
export const NoPriority: ReactPriorityLevel = 90;
```

```js
export type UpdateQueue<State> = {
  baseState: State,

  firstUpdate: Update<State> | null,
  lastUpdate: Update<State> | null,

  firstCapturedUpdate: Update<State> | null,
  lastCapturedUpdate: Update<State> | null,

  firstEffect: Update<State> | null,
  lastEffect: Update<State> | null,

  firstCapturedEffect: Update<State> | null,
  lastCapturedEffect: Update<State> | null,
};
```

```js
//   给出 base state:'' , 更新队列如下， 数字代表优先级， 每次更新往 base state 传入对应的字母。
//
//     A1 - B2 - C1 - D2
//
//   react 会将更新队列拆成两个 render ， 每个render每次处理一个 update。
//
//   First render, at priority 1:
//     Base state: ''
//     Updates: [A1, C1]
//     Result state: 'AC'
//
//   Second render, at priority 2:
//     Base state: 'A'            <-  The base state does not include C1,
//                                    because B2 was skipped.
//     Updates: [B2, C1, D2]      <-  处理 B2 时会对 C1 进行重构
//     Result state: 'ABCD'
```

react 对于 update 的处理是根据 update 插入顺序的， 对于跳过的 update ，在处理时会重构高优先级的 update 任务， 所以有的 高优先级的 update 会被执行两次， 但是 state 最终的结果都是一样的。
在处理低优先级的 update 时， 如处理 C1 时， D2 其实已经先于 C1 执行过了，那么在处理 C1 时， D2 直接复用之前的结果， 不需要再次更新视图。
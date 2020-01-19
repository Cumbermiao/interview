# React

> React 相对而言需要突出 Fiber 这块的重要性

## React Fiber

> 结合 合作调度模式 & 链表 

### 协程

> 协程的特点在于允许执行被挂起与被恢复，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。

### 合作调度模式

> 把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续下一个任务；如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候在继续执行。



## 面试解答

### Fiber

> 协程/合作调度模式 -> 出让控制权的实现 -> frame 的执行流程 -> 更多的话可以谈到浏览器的进程和线程

React Fiber 结合协程和合作调度模式的特点， 将更新任务拆分成多个子任务，执行更新任务时通过判断剩余时间出让控制权， 防止执行任务阻塞主线程导致浏览器卡顿。  
出让控制权是借助于 requestIdelCallback , 说是借助 requestIdelCallback 其实 React reconciler 里面通过 requestAnimation 和 message channel 自己实现了 polyfill ，因为其兼容性较差。  

a frame 的执行流程：
                                                CSS parser __
                                                            |
Input events callback --> requestAnimation --> HTML parser ---> caculate styles --> reLayout | create layout tree --> update/create layer tree --> paint(include create paint record)  --> composite(交给合成线程并行执行) --> requestIdelCallback

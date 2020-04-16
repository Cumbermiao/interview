# 前端路由

> 前端路由分为 history 和 hash 模式。 history 模式的实现得自于 h5 引入的 history api: pushState,repalceState 。

## history api

### go, back, forward

- back/forward: 类似用户点击了后退/前进按钮。
- go(n): 载入到会话历史中的某一特定页面， n 是相对于当前记录的相对位置。

#### pushState(state,title[,url])
- state: 用来创建 history 记录的状态。
- title: 大部分浏览器忽略该字段。
- url: 可选，创建 history 记录的 url。 需要注意， 在 popstate 回调调用后， 浏览器不会去加载该 url 。 但是在某些情况下， 如用户重启浏览器会加载该 url 。
== pushState 不会触发 hashchange 事件，即便浏览器的 hash 发生了改变。==

pushState 相对于 window.location 的优势：
- pushState 的 url 可以是任意同源的 url， 而使用 window.location 改变 hash 其 document 并没有改变。
- 使用 pushState 你可以不必改变 url， 而 window.location 只有当 hash 不一样时才会创建一个新的 history 记录。
- 使用 pushState 你可以使用相关的 data 创建 history 记录。而使用 hash 方式， 你需要将相关的数据编码成一个字符串。

#### replaceState

> repalceState 用法与 pushState 类似， 只不过其改变当前的 history 记录。

### onpopstate
每当处于激活状态的历史记录条目发生变化时,popstate事件就会在对应window对象上触发. 如果当前处于激活状态的历史记录条目是由history.pushState()方法创建,或者由history.replaceState()方法修改过的, 则popstate事件对象的state属性包含了这个历史记录条目的state对象的一个拷贝.

调用history.pushState()或者history.replaceState()不会触发popstate事件. popstate事件只会在浏览器某些行为下触发, 比如点击后退、前进按钮(或者在JavaScript中调用history.back()、history.forward()、history.go()方法).

## history 模式

> history 模式主要借助了 pushState/replaceState api 和 popstate 事件。

## hash 模式

> hash 模式分两种情况， 如果支持 pushState 则使用类似 history 模式的方法实现 否则通过监听 hashchange 事件和 window.location.hash 修改来实现。
# Vue-Router

Vue-Router 里面有3种模式: hash、history、abstract；
其中 history 模式依赖于浏览器 History Api，所以浏览器兼容方面没有 hash 模式好。

## History API

history 模式得益于 History API ， 接下来说明以下 API 的作用及特性。

### pushState(state, title [,url])

作用与 window.href 类似， 在当前的 document 种创建一个新的历史纪录并激活，其特点如下：

1. 激活该历史记录时， 浏览器不会立即加载该 url， 但是刷新、重启浏览器等操作会触发加载该 url（可以配置 nginx 解决）。

2. 新的 url 可以不同源。

3. 非强制修改 url ， 新的历史记录的 url 跟之前可以保持一致。

4. 可以在新的历史记录中关联任何数据。
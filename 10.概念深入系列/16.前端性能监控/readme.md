# 前端性能监控

## performance
## PerformanceTiming 属性
- navigationStart: 在当前浏览器上下文中卸载上一个 document 的时间。如果没有上一个 document 该值与 fetchStart 相同。

- unloadEventStart: unload 事件被抛出时的时间， 表示当前 document 开始卸载。If there is no previous document, or if the previous document or one of the needed redirects is not of the same origin, the value returned is 0.

- unloadEventEnd: unload 事件处理结束的时间。If there is no previous document, or if the previous document or one of the needed redirects is not of the same origin, the value returned is 0.

- redirectStart: 第一个 HTTP 重定向开始的时间。 如果没有重定向或者重定向的资源不是同源的则返回 0。

- fetchStart: 浏览器准备通过 http 请求 document ， 在检测缓存之前的时间。

- domainLookupStart/domainLookupEnd: 域查找开始/结束的时间。 如果使用了持久连接或者信息来源自缓存或者本地文件， 该值与 fetchStart 相同。

- connectStart/connectEnd: 开启连接的请求被发送到网络的时间/ 连接已经开启的时间。如果传输层报错且重新建立的连接，则使用最后一个发送请求的时间/连接开启的时间。

- requestStart: 浏览器发送请求获取实际 document 的时间。 如果传输层报错且重新建立连接， 使用新请求的时间。

- responseStart/responseEnd: 从服务端获取到的第一个/最后一个 byte 响应的时间。

- domLoading/domInteractive: html 解析器解析 dom， document.readyState 变为 loading 的时间/ html 解析 dom 结束， document.readyState 变为 interactive 的时间。

- domContentLoadedEventStart: 在触发 DOMContentLoaded 事件之前。

- domContentLoadedEventEnd: 在所有 script 执行之后。

- domComplete: 解析器结束任务， document.readyState 变为 complete 的时间。

- loadEventStart/loadEventEnd: load 事件被触发/结束的时间。


## PerformanceResourceTiming 属性
> PerformanceResourceTiming 接口支持检索和分析有关应用程序资源加载的详细网络定时数据。例如，应用程序可以使用时间度量来确定获取特定资源(如XMLHttpRequest、<SVG>、图像或脚本)所需的时间长度。
该接口继承自 PerformanceEntry。 PerformanceEntry 相关的属性如下：
- entryType: 固定值 `"resource"` 。
- name: resource 的 url。
- startTime：资源请求开始的 timestamp, 与 PerformanceEntry.fetchStart 相同。
- duration: responseEnd 与 startTime 的差值。

PerformanceResourceTiming 相关属性如下：
- initiatorType： 资源类型， 如 css, fetch, link, img, script 等。
- nextHopProtocol：请求资源使用的网络协议字符串, h2 表示 http 2。
- workStart： 返回一个 DOMHighResTimeStamp， 如果 service worker 线程已经运行在 dispatch FetchEvent 之前返回。如果 service worker 线程没有运行，在启动 service worker 线程启动前返回。
- redirectStart： 返回一个 DOMHighResTimeStamp，重定向请求开始的时间。
- redirectEnd：返回一个 DOMHighResTimeStamp, 获取到最后一个字节结束的时间。
- fetchStart：返回一个 DOMHighResTimeStamp, 浏览器开始请求资源之前的时间。
- domainLookupStart： 返回一个 DOMHighResTimeStamp， 在浏览器开始查找资源的域名之前。
- dommainLookupEnd： 返回一个 DOMHighResTimeStamp，浏览器结束域名查找时立即返回。
- connectStart： 返回一个 DOMHighResTimeStamp， 在浏览器与资源服务建立连接之前。
- connectEnd：返回一个 DOMHighResTimeStamp，浏览器结束与资源服务器连接。
- secureConnectionStart：返回一个 DOMHighResTimeStamp，在浏览器启动握手过程以保护当前连接之前。
- requestStart：返回一个 DOMHighResTimeStamp，浏览器开始从服务器请求资源之前。
- responseStart：返回一个 DOMHighResTimeStamp，浏览器接收到第一个字节响应之后的时间。
- responseEnd：返回一个 DOMHighResTimeStamp，浏览器接受到最后一个字节响应之后的时间。
- transferSize：表示获取的资源的大小(以字节为单位)的数字。大小包括 response header 和 payload body。
- encodedBodySize：解码前请求的 payload body 大小(以字节为单位)。
- decodedBodySize：解码后请求的 payload body 大小(以字节为单位)。
- serverTiming：包含服务器计时指标的PerformanceServerTiming条目数组。


## PerformanceObserver
> PerformanceObserver接口用于观察性能度量事件，并在浏览器的性能时间表中记录新的 performance entries 时得到通知。
== PerformanceObserver 可以用于 Web Worker 当中。== 
以下实例用来检测 paint 类型的性能事件。
```js
var observer = new PerformanceObserver(function(list,observer){
  console.log(list,observer)
})
observer.observe({entryTypes:['paint']})
```
## 准备

一定要配置 `host` ， 如果直接启动http服务并在 html 中设置 `document.domain='test.com'` 会报错 ：
`(index):13 Uncaught DOMException: Failed to set the 'domain' property on 'Document': 'test.com' is not a suffix of 'localhost'.` 
配置 host 
```
127.0.0.1 www.test.com
127.0.0.1 buyer.test.com
127.0.0.1 seller.test.com
```

配置代理
```
127.0.0.1:7000   www.test.com
127.0.0.1:7001   buyer.test.com
127.0.0.1:7002   seller.test.com
```

配置好以后，分别进入各自文件夹启动 `http` 服务, 使用域名访问之后, 查看能获取的 cookie。

以上使用的是 http 协议跨域进行 cookie 访问， 对于 file 协议好像是根据文件夹来判断是否同源， 有兴趣的同学可以试试 file 的跨域访问是如何操作的。


- 窗口之间能通信的情况 : window.open , iframe , 命名过或数值索引的window.frames

## window.open 通信
在 www.test.com 中使用 window.open 打开 buyer.test.com 页面。www.tset.com 为父窗口 , buyer.test.com 为子窗口。

www.test.com 在点击按钮时往子窗口buyer.test.com 发送消息。
```js
//www.tset.com
window.addEventListener('message',function(e){
  console.log(e)
},false)
var contentWin = window.open('http://buyer.test.com/');
console.log('contentWind',contentWin)
function send(){
  contentWin.postMessage('from www.test.com','http://buyer.test.com/')
}
```

子窗口往父窗口 www.test.com 发送消息, 点击按钮时发送信息。
```js
//buyer.test.com
window.addEventListener('message',e=>{
  console.log('buyer receive message:',e)
})
function sendMessage(){
  window.opener.postMessage("test data", "http://www.test.com/");
}
```

## iframe 通信
总得思路还是跟上面一样， 父窗口 www.test.com 通过 window.iframe[0] 发送消息给 子窗口 seller.test.com , 子窗口通过 window.parent 发送给父窗口消息。
具体实现查看 www.test.com 和 seller.test.com 的代码。

## 接受源与消息源之间的通信
首先解释一下消息源和接收源， 消息源是指发送消息的一方的窗口， 接收源则是接收消息的窗口。
只要接收源接收到了消息源的信息，接收源就可以获取消息源的窗口，从而给消息源返回消息。

message 事件的 event 会提供下面三个参数:
- event.source：发送消息的窗口
- event.origin: 消息发向的网址
- event.data: 消息内容

其中我们可以借助 event.source 往消息源的窗口发送消息。
```js
//接收源
var source;
window.addEventListener('message',e=>{
  console.log('buyer receive message:',e);
  source = e.source;
})
function sendMessage(){
  window.opener.postMessage("test data", "http://www.test.com/");
}
function sendWithSource(){
  if(source){
    source.postMessage('data send with source','http://www.test.com/');
    return 
  }
  console.log('source will be defined after parent window postMessage!')
}
``` 
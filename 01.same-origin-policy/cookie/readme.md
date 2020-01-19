## 准备

一定要配置 `host` ， 如果直接启动http服务并在 html 中设置 `document.domain='test.com'` 会报错 ：
`(index):13 Uncaught DOMException: Failed to set the 'domain' property on 'Document': 'test.com' is not a suffix of 'localhost'.` 
配置 host 
```
127.0.0.1 www.test.com
127.0.0.1 buyer.test.com
127.0.0.1 a.buyer.test.com
127.0.0.1 b.buyer.test.com
```

配置代理
```
127.0.0.1:7000   www.test.com
127.0.0.1:7001   buyer.test.com
127.0.0.1:7002   a.buyer.test.com
127.0.0.1:7003   b.buyer.test.com
```

配置好以后，分别进入各自文件夹启动 `http` 服务, 使用域名访问之后, 查看能获取的 cookie。

以上使用的是 http 协议跨域进行 cookie 访问， 对于 file 协议好像是根据文件夹来判断是否同源， 有兴趣的同学可以试试 file 的跨域访问是如何操作的。
<!-- 修改文件以冲突，合并时撤销删除 -->


本文参考 [阮一峰](http://www.ruanyifeng.com/blog/2016/04/cors.html) 的文章。

## CORS
> 全称:"跨域资源共享"（Cross-origin resource sharing）

CORS需要浏览器和服务器同时支持。目前，所有浏览器都支持该功能，IE浏览器不能低于IE10。

整个CORS通信过程，都是浏览器自动完成，不需要用户参与。浏览器一旦发现AJAX请求跨源，就会自动添加一些附加的头信息，有时还会多出一次附加的请求，但用户不会有感觉。

### 简单请求与非简单请求
浏览器将CORS请求分成两类：简单请求（simple request）和非简单请求（not-so-simple request）。 
只要同时满足以下两大条件，就属于简单请求。
1. 请求方法为 HEAD, GET, POST 之一。
2. HTTP 请求头信息不超过以下几种字段:
    - Accept
    - Accept-Language
    - Content-Language
    - Last-Event-ID
    - Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain。

而那些不满足上面两个条件的即是非简单请求。

#### 那么这两种请求之间有什么区别呢？
对于 `简单请求` , 浏览器会直接发起 `CORS` 请求， 然后根据服务器返回请求头中 `Access-Control-Allow-Origin` 是否包含发起请求的源， 不包含则会报跨域错误。

对于 `非简单请求` , 浏览器会发起一个预请求， 浏览器先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些HTTP动词和头信息字段。只有得到肯定答复，浏览器才会发出正式的XMLHttpRequest请求，否则就报错。


#### 请求头与响应头
- 对于简单请求来说， 一般只要设置 `Access-Control-Allow-Origin` 即可， 对于后台服务来说不是设置多个值， 而是判断当前的源是否在允许的数组之内， 如果在则设置`Access-Control-Allow-Origin`为对应的源， 否则不设置即可。

- 对于非简单的请求来说就需要根据请求头里面的多个字段来判断了， 首先浏览器会发起一个预请求， 预请求中的方法为`OPTIONS`， 所以后台服务需要在 `OPTIONS` 中来设置一下对应的响应头。第一个 `Access-Control-Allow-Origin` 肯定是要设置的 ； 第二个 `Access-Control-Request-Methods` 需要设置允许跨域的方法； 第三个 `Access-Control-Request-Headers` 设置响应头头中允许的字段， 如 `content-type`，`token`等， 可以根据请求头中`access-control-request-headers`来设置。
另外如果需要携带 `cookie` ， 那么客户端需要设置一下 `xhr.withCredentials =true`，服务端也需要设置`Access-Control-Allow-Credentials=true`。
对于预请求服务端可以通过`Access-Control-Max-Age`设置对于的有效时间。
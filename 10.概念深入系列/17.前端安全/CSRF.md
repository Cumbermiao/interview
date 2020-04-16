- [参考文章](https://juejin.im/post/5bc009996fb9a05d0a055192)

# CSRF

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

## 防范策略

### 同源检测

http 头中会带上 Referer 字段表示当前发起请求的地址。

### CSRF token

在用户首次访问页面的时候， 服务端生成一个加密 token 并存在 session 中， 客户端每次请求时需要带上 token ， 服务端校验 token 是否正确。 token 一般使用 js 直接添加到请求地址之后，防止存于 cookie 中又被攻击者获取。

### samesite

cookie 新增了一个 samesite 属性， 设置为 strict 时任何跨域请求都不会携带 cookie。 其缺点在于兼容性不好。
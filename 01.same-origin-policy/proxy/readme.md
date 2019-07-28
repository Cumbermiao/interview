interface 为 node 服务， webapp 为前端服务， 使用 nginx 配置代理， 在监听到 /interface 开头的请求时转发到后台服务。
nginx 配置
```
server{
    listen 7000;
    ssi on;
    
    location / {
        root F:/code/interview/01.same-origin-policy/proxy/webapp;
    }

    location /interface{
        proxy_pass http://localhost:3000;
    }
}
```

在不使用代理的情况下， webapp 服务的源为 http://localhost:7000 , node服务的源为 http://localhost:3000 ，由于端口不一致不同源， 直接请求 http://localhost:3000/getData
 等接口时发生跨域被浏览器拦截。

使用代理后， 在请求 http://localhost:7000/interface/getData 时转发到 http://localhost:3000 , 请求的源仍是 webapp 服务的源， 避免了跨域的情况。
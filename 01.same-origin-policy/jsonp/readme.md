`script.setAttribute('type','text/javascriptscript')`
网上看别人文章给`script`加了一个`type=text/javascript`属性, 加了这个根本就不会请求`src`的地址， 事实证明以后抄代码也要找权威的抄， 现在什么质量的代码都往上贴。

之前比较好奇 jquery 中是如何存储 jsoncallback 的返回值的， 本来想如果存储在全局变量中， 那么结束的时候都需要删除该存储， 实现的方式不够优雅。 简单看了一下其中的代码， 代码如下:

```js
jQuery.ajaxPrefilter('json jsonp', function(s, originalSettings, jqXHR) {
  var inspectData =
    s.contentType === 'application/x-www-form-urlencoded' &&
    typeof s.data === 'string';

  if (
    s.dataTypes[0] === 'jsonp' ||
    (s.jsonp !== false &&
      (jsre.test(s.url) || (inspectData && jsre.test(s.data))))
  ) {
    console.log(s.url);
    var responseContainer,
      jsonpCallback = (s.jsonpCallback = jQuery.isFunction(s.jsonpCallback)
        ? s.jsonpCallback()
        : s.jsonpCallback),
      previous = window[jsonpCallback],
      url = s.url,
      data = s.data,
      replace = '$1' + jsonpCallback + '$2';
    console.log('jsonpCallback', jsonpCallback);
    if (s.jsonp !== false) {
      url = url.replace(jsre, replace);
      if (s.url === url) {
        if (inspectData) {
          data = data.replace(jsre, replace);
        }
        if (s.data === data) {
          // Add callback manually
          url += (/\?/.test(url) ? '&' : '?') + s.jsonp + '=' + jsonpCallback;
        }
      }
    }

    s.url = url;
    s.data = data;

    // Install callback
    window[jsonpCallback] = function(response) {
      responseContainer = [response];
    };

    // Clean-up function
    jqXHR.always(function() {
      // Set callback back to previous value
      window[jsonpCallback] = previous;
      // Call if it was a function and we have a response
      if (responseContainer && jQuery.isFunction(previous)) {
        window[jsonpCallback](responseContainer[0]);
      }
    });

    // Use data converter to retrieve json after script execution
    s.converters['script json'] = function() {
      if (!responseContainer) {
        jQuery.error(jsonpCallback + ' was not called');
      }
      return responseContainer[0];
    };

    // force json dataType
    s.dataTypes[0] = 'json';

    // Delegate to script
    return 'script';
  }
});
```

你会发现其生成的 jsoncallback 实际实现是
```js
window[jsonpCallback] = function(response) {
  responseContainer = [response];
};
```
很简单， 直接在初始化的时候使用了闭包， 在 success 回调中使用将该变量传入， 具体的 success 使用的是 defered.resolveWith() 方法， 感兴趣的可以自己去看看。

在火狐上面出现了一些问题， 本来以为是我 jsonp 函数写的有问题， 后来使用了 jquery 的 jsonp 也是同样的问题。
`即使其 MIME 类型（“text/html”）不是有效的 JavaScript MIME 类型，仍已加载来自“http://localhost:3000/getData?callback=foo&_=1564054941476”的脚本。`
看了一下简单的介绍， 应该是服务端需要设置 contentType 为 text/javascript 。

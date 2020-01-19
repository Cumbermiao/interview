看下面的代码有没有问题？
```js
function func(item){
  setTimeout(()=>{console.log(item);},0);
}

async function processArray(arr){
  arr.forEach(item => {
    await func(item)
  });
}
processArray([1,2,3,4]); //Uncaught SyntaxError: await is only valid in async function
```

如何解决?
```js
async function processArray(arr){
  arr.forEach(async item => {
    await func(item)
  });
}
processArray([1,2,3,4]); //1 2 3 4
```
完美解决！

此时面试官不会罢休， 上面的问题虽然解决了， 但是现在想要在队列里面发送异步请求， 上面的做法就出现了问题。 每次发完请求时需要等到上一个请求结束才可发送下一个。 
继续改造。

```js
async function processArray(arr){
  arr.forEach(async item => {
    await func(item)
  });
}
processArray([1,2,3,4]); //1 2 3 4
```

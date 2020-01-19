# Promise

## 规范

我们最基础需要知道的就是 Promise 有三个状态， 状态一旦改变便无法修改。

- pending 初始状态
- resolved(fulfilled) 成功状态
- rejected 失败状态

除了上面的基础状态，我们还需要熟悉常用的 api ， 以及其特点。

#### Promise.resolve(value)

> 类方法，该方法返回一个以 value 值解析后的 Promise 对象
> 1、如果这个值是个 thenable（即带有 then 方法），返回的 Promise 对象会“跟随”这个 thenable 的对象，采用它的最终状态（指 resolved/rejected/pending/settled）
> 2、如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。
> 3、其他情况以该值为成功状态返回一个 Promise 对象。

```js
//如果传入的 value 本身就是 Promise 对象，则该对象作为 Promise.resolve 方法的返回值返回。
function fn(resolve) {
  setTimeout(function() {
    resolve(123);
  }, 3000);
}
let p0 = new Promise(fn);
let p1 = Promise.resolve(p0);
// 返回为true，返回的 Promise 即是 入参的 Promise 对象。
console.log(p0 === p1);
```

> ES6 Promises 里提到了 Thenable 这个概念，简单来说它就是一个非常类似 Promise 的东西。最简单的例子就是 jQuery.ajax，它的返回值就是 thenable 对象。但是要谨记，并不是只要实现了 then 方法就一定能作为 Promise 对象来使用。

#### Promise.reject

> 类方法，且与 resolve 唯一的不同是，返回的 promise 对象的状态为 rejected。

#### Promise.protype.then

> 实例方法，为 Promise 注册回调函数，函数形式：fn(vlaue){}，value 是上一个任务的返回结果，then 中的函数一定要 return 一个结果或者一个新的 Promise 对象，才可以让之后的 then 回调接收。  
> then 方法中有两个参数： onFulfilled onRejected ， 当 state 为 fulfilled 时执行 onFulfilled 回调， 传入 this.value ， state 为 rejected 时执行 onRejected 回调， 传入 this.reason 。

#### Promise.prototype.catch

> 实例方法，捕获异常，函数形式：fn(err){}, err 是 catch 注册 之前的回调抛出的异常信息。

#### Promise.race

> 类方法，多个 Promise 任务同时执行，返回最先执行结束的 Promise 任务的结果，不管这个 Promise 结果是成功还是失败。

#### Promise.all

> 类方法，多个 Promise 任务同时执行。
> 如果全部成功执行，则以数组的方式返回所有 Promise 任务的执行结果。 如果有一个 Promise 任务 rejected，则只返回 rejected 任务的结果。

## Promise 手写

```js
function MyPromise(executor) {
  this.status = "pending";
  this.value = undefined;
  this.reason = undefined;
  const resolve = param => {
    if (this.status === "pending") {
      //1. 修改 status
      this.status = "resolve";
      //2. 返回 thenable 对象
      return {};
    }
  };
  const reject = () => {
    this.status = "rejected";
    return {};
  };

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
```

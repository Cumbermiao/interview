# 面试题及解答

## 1.jpg 面试题

> 详细调试在 1.html 中

1. 如右图所示,屏幕正中间有个元素 A 随着屏幕宽度的增加
   始终需要满足以下条件
   A 元素垂直居中于屏幕中央
   A 元素距离屏幕左右边距各 10px
   A 元素里面的文字”A"的 font-size:20px;水平垂直居中;
   A 元素的高度始终是 A 元素宽度的 50%;(如果摘不定可以实现为 A 元素的高
   度固定为 200px)
   请用 htm 及 css 实现

```html
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {
        margin: 0;
      }
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
        margin: 0 10px;
      }
      .inner {
        flex: 1;
        text-align: center;
        background: lightblue;
        color: #fff;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        /* padding 为百分比时以父元素的宽度为基准 */
        padding: 25% 0;
        height: 0;
      }
    </style>
  </head>

  <body>
    <div class="wrapper">
      <div class="inner">A</div>
    </div>
  </body>
</html>
```

此题主要考察 ==居中布局 和 padding 以百分比为单位时基于父元素的宽度。==

2. 函数中的 arguments 是数组吗?若不是,如何将它转化为真正的数组。

不是数组， 只是带有迭代器 iterator 的对象。转成数组方法如下:

- 使用 Array.from 将类似数组或可迭代对象
- 使用 Array 的原型方法转成数组

3. 下列代码的输出

```js
if ([] == false) console.log(1);
if ({} == false) console.log(2);
if ([]) console.log(3);
if ([1] == [1]) console.log(4);
```

考察各操作符下的隐式转换规则：
`[]==false` 相等操作符比较时， 有一个为 boolean 类型时， 转换成 number 类型比较， `Number([])` 结果为 0 。

`{}==false` 同上， `Number({})` 结果为 NaN ， 因为 `([]).toString()` 为 `""` , `({}).toString()` 为 `[object Object]` , 在调用 Number 转换时空对象会变成 NaN。

`if([])` 可以转换成 `if([]==true)` , 思路同上。

`[1]==[1]` 比较两个数组的引用。

4. 下列代码输出。

考察 js 引擎的 event loop， 需要特别注意调用 await 后面的代码相当于在 then 中执行。

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end ");
}
async function async2() {
  console.log("async2");
}
console.log("script start");
setTimeout(function() {
  console.log("setTimeout");
}, 0);
async1();
new Promise(function(resolve) {
  console.log("promise1");
  resolve();
}).then(function() {
  console.log("promise2");
});
console.log("script end");
```

## 3.jpg 面试题

5. 以最小的改动解决以下代码的错误（可以使用 es6）

考察作用域和箭头函数的 this 指向。

```js
const obj = {
  name: ' jsCoder',
  skill: ['es6', 'react', 'angular'],
  say: function () {
    for (var i = 0, len = this.skill.length; i < len; i++) {
      setTimeout(function () {
        console.log('No.' + i + this.name)
        console.log(this.skill[i])
        console.log('--------------')
      }, 0)
      console.log(i)
    }
  }
}
obj.say();
```

6.  实现 Function 原型的 bind 方法， 使得以下程序最后能输出 'success'。
考察 bind 实现，需要注意 函数被 bind 之后使用 new 的情况。
```js
function Animal(name, color) {
  this.name = name;
  this.color = color;
}
Animal.prototype.say = function () {
  return `I am a ${this.color} ${this.name}`
}
const Cat = Animal.bind(null, 'cat')
const cat = new Cat('white')
if (cat.say() === 'I am a white cat' && cat instanceof Cat && cat instanceof Animal) {
  console.log('success')
}
```


## 2.jpg 面试题

7. 代码实现函数节流 throttle 。

考察节流函数的实现， 此处需要注意根据题目中触发函数和执行函数的图， == 在该段时间内触发多次时， 需要在时间限制过后， 执行最后一次触发的函数 ==。
节流与防抖的区别：
  - 节流： 函数执行的周期内， 函数被触发多次， 只执行第一次触发的函数。
  - 防抖： 在时间周期内， 函数被触发多次， 前面的函数不断被取消并被替换， 执行最后一次触发的函数。

8. 请用算法实现,从给定的无序、不重复的数组data中,取出n个数,使其相加和为sum。并给出算法的时间倥空间复杂度。(不需要找到所有的解,找到一个解即可)

使用回溯法实现， 优化可以借助 hash table 实现。
````

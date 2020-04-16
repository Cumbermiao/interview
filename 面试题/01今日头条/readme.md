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
  name: " jsCoder",
  skill: ["es6", "react", "angular"],
  say: function() {
    for (var i = 0, len = this.skill.length; i < len; i++) {
      setTimeout(function() {
        console.log("No." + i + this.name);
        console.log(this.skill[i]);
        console.log("--------------");
      }, 0);
      console.log(i);
    }
  }
};
obj.say();
```

6.  实现 Function 原型的 bind 方法， 使得以下程序最后能输出 'success'。
    考察 bind 实现，需要注意 函数被 bind 之后使用 new 的情况。

```js
function Animal(name, color) {
  this.name = name;
  this.color = color;
}
Animal.prototype.say = function() {
  return `I am a ${this.color} ${this.name}`;
};
const Cat = Animal.bind(null, "cat");
const cat = new Cat("white");
if (
  cat.say() === "I am a white cat" &&
  cat instanceof Cat &&
  cat instanceof Animal
) {
  console.log("success");
}
```

## 2.jpg 面试题

7. 代码实现函数节流 throttle 。

考察节流函数的实现， 此处需要注意根据题目中触发函数和执行函数的图， == 在该段时间内触发多次时， 需要在时间限制过后， 执行最后一次触发的函数 ==。
节流与防抖的区别：

- 节流： 函数执行的周期内， 函数被触发多次， 只执行第一次触发的函数。
- 防抖： 在时间周期内， 函数被触发多次， 前面的函数不断被取消并被替换， 执行最后一次触发的函数。

8. 请用算法实现,从给定的无序、不重复的数组 data 中,取出 n 个数,使其相加和为 sum。并给出算法的时间倥空间复杂度。(不需要找到所有的解,找到一个解即可)

使用回溯法实现， 优化可以借助 hash table 实现。

```js
function getResult(data, n, sum) {
  data.sort((a, b) => a - b);

  function backtracking(template, idx, count, restSum, data) {
    if (count == 0 && restSum == 0) return true;
    if (count <= 0 || restSum <= 0 || idx >= data.length) return;
    if (count > 0 && restSum >= 0) {
      for (let i = idx; i < data.length; i++) {
        template.push(data[i]);
        if (backtracking(template, i + 1, count - 1, restSum - data[i], data))
          return template;
        template.pop();
      }
    }
  }

  let res = [];
  if (backtracking(res, 0, n, sum, data)) return res;
}
```

## 汇总题目

### HTML & CSS 相关

1. css 栅格布局 
> 参考前端开发题库.html TAG:1

2. css 伪类和伪元素
> 记忆方法: love
CSS 伪类： link visited hover active focus 
CSS 伪元素： before after first–letter 选取元素的首个字符  first–line 选取元素的第一行 selection

3. click DOM 节点的 inner 与 outer 的执行机制，考查事件冒泡与事件捕获
当一个 DOM 事件被触发时， 会经历以下几个阶段：
- 捕获阶段：先由文档的根节点document往事件触发对象，从外向内捕获事件对象；
- 目标阶段：到达目标事件位置（事发地），触发事件；
- 冒泡阶段：再从目标事件位置往文档的根节点方向回溯，从内向外冒泡事件对象。

使用 addEventListener 绑定的事件默认是在冒泡阶段执行， 其第三个参数 useCapture 默认为 false。

详细的 DOM 事件流参考 [文章](https://zhuanlan.zhihu.com/p/51611590)

4. 屏幕沾满和未沾满的情况下， 使 footer 固定在底部，尽量使用多种方法  

- position: fixed

- 屏幕未沾满的情况下
> TODO: 为何 mycontent 的高度与 body 一样后， footer 没有被挤出屏幕？
```html
<!DOCTYPE html>
<html>
 
	<head>
		<meta charset="UTF-8">
		<title>TEST</title>
 
		<style type="text/css">
			* {
				margin: 0;
				padding: 0;
			}
			
			body {
				font: 14px/1.8 arial;
			}
			
			html,
			body,
			.mycontent {
				height: 100%;
			}
			
			.mycontent {
				height: auto;
				min-height: 100%;
				font-size: 18px;
				text-align: center;
			}
			
			.main {
				padding-bottom: 80px;
			}
			
			.myfooter {
				position: relative;
				height: 80px;
				line-height: 80px;
				margin-top: -80px;
				background: #333;
				color: #fff;
				font-size: 16px;
				text-align: center;
			}
		</style>
 
	</head>
 
	<body>
		<div class="mycontent">
			<div class="main">
 
				<h1>春晓</h1>
				<p>春眠不觉晓，</p>
				<p>处处闻啼鸟。</p>
				<p>夜来风雨声，</p>
				<p>花落知多少。</p>
 
 
			</div>
		</div>
		<div class="myfooter">
			<h1>页面高度不满屏幕高度，footer固定于底部</h1>
		</div>
	</body>
 
</html>
```

5. css 单行和多行省略
- 单行省略
```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```
- 多行省略（不兼容ie）
```
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 2;（行数）
-webkit-box-orient: vertical;
```

6. css 3 新特性
- 增加了一些新的选择器， 如属性选择器、父子选择器等
- 增加了一些实用的功能， 如自定义字体、圆角属性、边框颜色等。
- 增加了变形、变换和动画等功能。 

7. 盒模型的两种计算方式
- 标准盒模型： width 就是 content 的宽度
- IE盒模型： width = content + padding + border 

8. display 的各个属性值
参考[菜鸟教程](https://www.runoob.com/cssref/pr-class-display.html)

9. meta 标签的用处
- name属性如 keywords、content、description 描述网站， seo 优化。
- http-equiv 属性如 content-type 描述网页的类型和编码格式。
- 其他还可以设置缓存， http-equiv 设置 cache-control， 与 http 中的缓存字段一致。

10. bfc

block formatting context 块级格式上下文， 当元素触发 bfc 时， 会按照对应的规则渲染该元素。  
触发 bfc 的条件：
浮动元素和绝对定位元素，非块级盒子的块级容器（例如 inline-blocks, table-cells, 和 table-captions），以及overflow值不为“visible”的块级盒子，都会为他们的内容创建新的BFC（块级格式上下文）。

bfc 用处：
- 解决浮动导致的高度问题、文字环绕问题
- 解决上下 margin 重合的问题

11. css 绘制三角形

- 使用 border 绘制
```css
width: 0;
height: 0;
border-top: 10px solid red;
border-left: 10px solid transparent;
border-right: 10px solid transparent;
```
- 使用一个正方形， 旋转 90 度之后使用伪元素遮挡一半

- 使用伪元素进行 skew + rotate 形变成菱形， 通过 overflow hidden 遮挡一半

12. css 水平垂直居中， 双栏固定布局

- 水平垂直居中
  - 使用弹性布局
  - 水平居中使用 margin:0 auto ; 垂直居中使用 top: 50%; transform: translateY(-50%)
  - top:50%;left:50%; transform: translate3d(-50%,-50%,0)

13. 双栏固定布局
- 两栏固定高度的话可以给两个元素 float , 设置高度， 清除浮动即可
- 两栏高度不固定， 给其中一个元素 float ， 另一个元素生成 bfc ， 在清除浮动即可。

### js 相关

1. this 指向 & 箭头函数
- 箭头函数中 this 指向其定义的词法环境的父级
- 函数如果有调用者， 其 this 指向调用者， 否则指向 window

2. TODO: event loop

3. 闭包  
概念： 函数在其定义的词法环境以外被调用， 函数仍能够访问其定义所在的词法环境， 这种现象就是闭包。闭包是基于词法环境书写代码的自然结果。

4. es6 和 es5 的作用域
es5 中只有函数作用域， es6 中新增了 let 和 const 局部作用域。 let 实现也是借助于闭包。

5. 是否系统性学习过 es6 TODO:

6. 多个 bind 连接后输出的值

每次 bind 之后的 this 都会改变。
```js
var a = {name:'a'}
var b = {name:'b'}
var fn = function(){
  console.log(this.name)
}
var fn1 = fn.bind(a)
var fn2 = fn1.bind(b)
fn1() //a
fn2() //b
```

7. 事件委托
> 把子节点的监听函数定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方法叫做事件的代理（delegation）。  
事件委托的优点:
- 减少内存消耗，提高性能。 对于每个子元素绑定事件显然没有给父元素绑定事件节省资源。
- 动态绑定事件。 对于子元素有增删的时候，给父元素绑定事件显然更加方便。

8. proxy
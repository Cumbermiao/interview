# 闭包

闭包在面试问起来一般回答就是在函数中返回另一个函数， 另一个函数能够获取函数中的变量。
这个回答感觉意思到了， 但实际上没有对闭包的定义深入了解， MDN 中对于闭包的定义如下：

> 函数与对其状态即词法环境（lexical environment）的引用共同构成闭包（closure）。也就是说，闭包可以让你从内部函数访问外部函数作用域。在 JavaScript，函数在每次创建时生成闭包。

令人诧异的是在我搜索关键字 "closure MDN" 还发现了 [Stack Overflow](https://stackoverflow.com/questions/50529400/is-the-definition-of-javascript-closures-on-mdn-wrong) 上面对于 MDN 上 closure 的争论。

你不知道的 js 上册中对于闭包也有如下的定义：

> - 当函数可以记住并访问所在的词法作用域时，就产生了闭包，即使函数是在当前词法作用域之外执行。
> - 闭包是基于词法作用域书写代码时所产生的自然结果。
>   其还对闭包的行为结果进行了阐述：
>   这个函数在定义时的词法作用域以外的地方被调用。闭包使得函数可以继续访问定义时的词法作用域。

以上的各种定义解释涉及了一些名词: lexical enviroment , lexical scope 。

## lexical environment & lexical scope

### v8 编译步骤

1. 分词/词法分析（Tokenizing/Lexing）
2. 解析/语法分析（Parsing）
3. 生成可执行代码

在第一步中的词法分析，它会登记变量声明、函数声明、函数声明的形参， 后续代码执行的时候就知道去哪里拿变量的值和函数了， 这个登记的地方就是 `Lexical Enviroment(词法环境)`

### Lexical environment 结构

词法环境是在代码定义的时候决定的，跟代码在哪里调用没有关系。所以说 JavaScript 采用的是词法作用域（静态作用域）。

Lexical environment 由 enviromentRecord 和 outer 两部分组成

```js
environment = {
  // storage
  environmentRecord: {
    type: "declarative",
    // storage
  },
  // reference to the parent environment
  outer: <...>
};
```

#### environmentRecord

environmentRecord 分为声明式环境记录和对象式环境记录

##### Declarative Environment Record 声明式环境记录

> 用来记录直接由标识符定义的元素， 比如变量、常量、let、class、module、import 以及函数声明

声明式环境记录又分为两类

- 函数环境记录（Function Environment Record）：用于函数作用域。
- 模块环境记录（Module Environment Record）：模块环境记录用于体现一个模块的外部作用域，即模块 export 所在环境。

##### Object Environment Record 对象式环境记录

> 主要用于 with 和 global 的词法环境


## 解释闭包
```js
function foo() {
  var a = 2;
  function bar() {
    console.log(a);
  }
  return bar;
}
var baz = foo();
baz(); // 2 —— 朋友，这就是闭包的效果
```
使用你不知道的js 中的说法， foo 的词法环境中定义了 a 和 函数 bar ， bar 的词法环境的 outer 指向的是 foo ， 所以能否访问到变量 a 。   
foo 执行后返回了 bar 的引用并赋给了 baz ， 而 baz 是定义在全局词法环境中， 其执行时 bar 的所处的词法环境不是 foo ， 但由于其 outer 指向 foo 所以还是能访问 a 。  
这种不在定义所处的词法环境中执行获取其定义所在的词法环境的方法就是闭包。


## 面试解答

> 经过上面的梳理， 相对而言， 你不是道的 js 中所描述的相对合理一点。可以==从闭包的概念延伸至 js 代码的编译过程和词法环境==。

闭包是基于词法作用域书写代码所产生的自然结果。在外部函数被定义的时候，其词法作用域就已经被确定，内部函数就在其中。如果内部函数被返回， 被外面的变量接受，此时执行内部函数则脱离的原本的词法作用域，但是其仍可以访问原本的词法作用域。

js 编译分为 分词/词法分析（Tokenizing/Lexing）、解析/语法分析（Parsing）、生成可执行代码。 词法作用域主要结构分为 environmentRecord 和 outer， 其中 environmentRecord 记录相应环境中的形参，函数声明，变量声明等 outer 表示指向父级的词法环境
## 范畴论

同一个范畴的所有成员，就是不同 态的变形。通过态射，一个成员可以变形成另一个成员。

### 范畴：满足某种变形关系的所有对象。

- 范畴是一个集合
- 变形关系是函数
- 范畴论是集合论更上层的抽象，简单的理解就是"集合 + 函数"。理论上通过函数，就可以从范畴的一个成员，算出其他所有成员。
- 范畴可以当做成容器，里面包含了值和函数。

## 函数式编程

### pointfree:函数里不使用中间变量，因为他们没有意义。

```
var f = str=>str.toUpperCase().split('')
//纯函数写法,f变得纯了，其他的地方就会变得不纯，根据实际取舍
var toUpperCase = str=>str.toUpperCase()
var split = x=>(str=>str.split(x))
var f=_.compose(toUpperCase,split(''))
```

### 声明式代码和命令式代码

- 声明式的代码要交代程序的过程，命令式的代码关心的是结果。
- 平常我们可以使用命令式的代码，优化的时候我们仅关心过程的优化。不需要关心外部的依赖或副作用。

```
//声明式
let name=[]
for(var i=0;i<arr.length;i++){
    name.push(arr[i].name)
}

//命令式
let name = arr.map(item=>return item.name)
```

### 函数的合成与柯里化

- 函数的合成应该满足交换律和合成律。所以要求函数必须要“纯”。
- 使用函数的柯里化可以传递结合的函数所需要的参数。就是函数的预加 zai

### 惰性函数

```
function ajax(){
    if(XMLHttpRequest){
        ajax = function(){
            return new XMLHttpRequest()
        }
    }else{
        ajax = function(){
            return new ActiveXObject("Microsoft.XMLHTTP)
        }
    }
}
//ajax 先判断是否为标准浏览器，然后更改函数体，函数运行一次函数体被改变以后不需要判断是否为标准浏览器。
```

### 惰性链

```
var con = lazy([1,2,3]).slice(1).splice(0,1,'x')
var res = con.end()
//con存储了lazy的一系列操作，但是操作都没有执行，存储的其实是代码
//当执行了end方法时，执行存储的代码块，获取了结果。
```

### 纯函数

- 对于相同的输入，永远会得到相同的输出，而且没有任何的副作用，也不依赖外部环境的状态。

```
var xs =[1,2,3,4,5]
xs.slice(0,3)
xs.slice(0,3)
//输出结果相同
```

#### 纯函数的主要应用之一就是缓存

```
// 简单实现momize
var memoize = function(f) {
    var cache = {};

    return function() {
      console.log(cache,arguments)
      var arg_str = JSON.stringify(arguments);
      cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
      return cache[arg_str];
    };
  };

  var double = memoize(function(x){return 2*x})
  var double4 = double(4)
  var double42 = double(4)//再次执行该函数时，memoize中缓存了参数为4的结果，会从cache中取值。
```

#### 由于异步结果是不纯的，我们可以缓存异步的执行函数，将其变成纯函数。

### 递归优化：尾递归

- 递归会存储大量的变量，占用过多的 cpu 甚至导致栈溢出。

```
function sum(x){
    if(x===1){
        return 1
    }else{
        return sum(x-1)+x
    }
}

//尾递归
function sum(x,total){
    if(x===1)return 1+total
    else{
        return sum(x-1,x+total)
    }
}
```

## 函子

- 函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
- 函子首先他是一个容器，他有范畴， 特殊的在于他可以作用于范畴里每一个值，将一个容器转换成另一个容器。作用于每一个值就是靠的 map 方法。
- 函数式编程的要点在于函子，一般情况下使用 of 方法生成一个函子，使用 map 生成一个使用 fn 处理过的函子。

```
class Functor{
    constrouctor(val){
        this.value = val
    }
    map(f){
        return Functor.of(f(this.val))
    }
}
Functor.of =function(val){
    return new Functor(val)
}

//使用
Functor.of(2).map(function(item)=>{
    return item+10
})
```

### Maybe 函子

- Maybe 函子用于处理函子传入的 val 为空，导致报错

```
class Maybe extends Functor{
    map(f){
        return this.value?this.of(f(this.value)):this.of(null)
    }
}
```

### Either 函子

- 与 Maybe 类似，但是需要传两个参数，一个是默认参数，一个是 real 参数。可用于 if...else 和 try...catch

```
class Either{
    constructor(left,right){
        this.left=left
        this.right=right
    }
    map(f){
        return this.right?Either.of(this.left,f(this.right)):Either.of(f(this.left),this.right)
    }
}
```

### AP 函子

- 函子的 value 可能是值，也有可能是函数，如果想让一个函子的值传入到另一个函子的方法，就要使用 ap 函子
- 下面的情况是 AP 的 value 为函数，map 接收函子的 value 是值

```
class AP extends Functor{
    constructor(val){
        this.value = val
    }
    ap(Functor){
        return AP.of(this.value(Functor.value))
    }
}
AP.of = function(val){
    return new AP(val)
//将b传入到a里
var add2 = function(x){return x+2}
let a = Functor.of(add2)
let b = Functor.of(10)
AP.of(add2).ap(b)

```

### IO 函子

- IO 函子里面 value 是一个函数，该函数一般使用闭包 return 一个函数，里面存放的都是不纯的操作。

```
class IO extends Functor{
    constructor(val){
        this.value = val
    }
}

const fs = require('fs')
var read = function(filename){
    return fs.readFileSync(filename,'utf-8')
}
let readFile = new IO(read)
```

### Monad 函子

- Monad 函子用来解决 函子 嵌套的情况，如果多个 函子 嵌套，那么取到 value 就需要多次 this.value。
- Monad 函子 每次返回一个单层的函子，其 flapMat 方法与 map 类似，但是如果嵌套函子时，它会取出上一层的 value，返回一个单层的函子。

```
class Monad extends Functor{
    join(){
        return this.value
    }
    flapMat(f){
        return this.map(f).join()
    }
}

//如果f是个函子，那么 map后会嵌套一层，join方法返回value，又将嵌套去掉了。
```

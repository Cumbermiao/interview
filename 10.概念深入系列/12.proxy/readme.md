# Proxy

> Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

## 基本语法
`let p = new Proxy(target, handler);`

### 参数
- `target` : 用 Proxy 包装的目标对象， 可以是任何类型的对象， 包括原生数组，函数，甚至另一个代理。  

- `handler` : 一个对象， 其属性是当执行一个操作时定义代理的行为的函数。 

## 方法
- Proxy.revocable() : 创建一个可撤销的 Proxy 对象。

## handler 对象的方法

1. `handler.apply()` : 拦截函数的调用。

2. `handler.construct()` : 用于拦截 `new` 操作符时所执行的构造函数。 

3. `handler.defineProperty()` : 拦截对对象的 `Object.defineProperty()` 操作。

4. `handler.deleteProperty()` : 拦截对对象属性的 `delete` 操作。

5. `handler.get()` : 拦截对象的读取属性操作。

6. `handler.getOwnPropertyDescriptor()` : `Object.getOwnPropertyDescriptor()` 的钩子。

7. `handler.getPrototypeOf()` : `Object.getPrototypeOf()` 的钩子。

8. `handler.has()` : 针对 `in` 操作符的代理方法。

9. `handler.isExtensible()` : `Object.isExtensible()` 的钩子。

10. `handler.ownKeys()` : 拦截 `Reflect.ownKeys()` 。

11. `handler.preventExtensions()` : `Object.preventExtensions()` 的钩子。

12. `handler.set()` : 拦截设置属性值的操作。

13. `handler.setPrototypeOf()` : `Object.setPrototypeOf()` 的钩子。
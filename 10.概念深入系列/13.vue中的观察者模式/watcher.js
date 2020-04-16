/**
 * @author miaoxiongtao
 * @date 2020.02.04
 * @description 简易版的观察者模式， 只支持 nodeType 为文本标签和输入框的自动更新
 */

//Dep 的功能就是收集 watcher ， 并在 data 触发 set 方法时通知 watcher 更新
class Dep {
  constructor() {
    this.watcherList = [];
  }
  //watcher 实例
  addSub(watcher) {
    this.watcherList.push(watcher);
  }
  notify() {
    //缺点： 所有 watcher 都被通知， 即使这个 watcher 订阅的 key 不一样
    this.watcherList.forEach(watcher => {
      watcher.update();
    });
  }
}

//watcher 是订阅数据更新的对象， 是绑定了 data 数据的元素， 每个元素的每个 key 都会创建一个 watcher 实例
class Watcher {
  constructor(vm, ele, key, type) {
    //注意 this.update 中触发了 data[key] 的 get 方法， 将此实例添加到 Dep 实例的订阅者中
    Dep.target = this;
    this.vm = vm;
    this.ele = ele;
    this.key = key;
    this.type = type;
    this.update();
    Dep.target = null;
  }

  get() {
    //从 vm 中获取变动的值
    return this.vm[this.key];
  }
  update() {
    //通过 ele.value | ele.nodeValue 直接更新视图
    this.ele[this.type] = this.get();
  }
}

function observe(data, vm) {
  const keys = Object.keys(data);
  !vm.dep && (vm.dep = new Dep());
  keys.forEach(key => {
    defineReactiveKey(vm, key, data[key]);
  });

  function defineReactiveKey(obj, key, value) {
    Object.defineProperty(obj, key, {
      get: function() {
        if (Dep.target) {
          vm.dep.addSub(Dep.target);
        }
        console.log('get');
        return value;
      },
      set: function(val) {
        if (val === value) return;
        value = val;
        vm.dep.notify();
      }
    });
  }
}

function Compile(node, vm) {
  //HTML element
  if (node) {
    var frag = document.createDocumentFragment(),
      firstChild;
      debugger;
    while ((firstChild = node.firstChild)) {
      compileElement(firstChild, vm);
      frag.append(firstChild); // append 方法会从 node 中删除 firstChild
    }
  }
  return frag;
}
function compileElement(ele, vm) {
  var reg = /\{\{(.*)\}\}/;
  if (ele.nodeType === 1) {
    var attrs = ele.attributes;
    for (var i = 0; i < attrs.length; i++) {
      if (attrs[i].nodeName === "v-model") {
        var key = attrs[i].nodeValue;
        ele.addEventListener("input", function(e) {
          vm[key] = e.target.value;
        });
        new Watcher(vm, ele, key, "value");
      }
    }
  } else if (ele.nodeType === 3) {
    if (reg.test(ele.nodeValue)) {
      var key = RegExp.$1;
      key = key.trim();
      new Watcher(vm, ele, key, "nodeValue");
    }
  }
}

function Vue(options) {
  this.el = options.el;
  this.data = options.data;
  var root = document.getElementById(this.el);
  observe(this.data, this);

  root.appendChild(Compile(root, this));
}

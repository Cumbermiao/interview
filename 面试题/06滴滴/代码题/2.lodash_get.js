/**
 * lodash _get 方法
 */

function _get(object,path,defaultValue){
  if(Object.prototype.toString.call(object) === '[object Object]'){
    if(typeof path === 'string'){
      let i = 0;
      let curObj = object
      while(i<path.length){
        const key = path[i]
        if(key==='['||key===']'||key==='.'){
          i++
        }else{
          if(curObj[key]===undefined)return defaultValue
          curObj = curObj[key]
          i++
        }
      }
      return curObj === undefined ? defaultValue : curObj
    }
  }
}


// @test
const obj1 = {a:{b:{c:{d:{e:1}}}}}
console.log(_get(obj1,'a.b.c.d.e',2))
console.log(_get(obj1,'a.b.c.d.e.f',2))

const obj2 = {a:[{b:[{c:{d:1,e:undefined}}]}]}
console.log(_get(obj2,'a[0].b[0].c.d',2))
console.log(_get(obj2,'a[0].b[0].c.e',2))
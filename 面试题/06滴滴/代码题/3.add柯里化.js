/**
 * 实现 add(1)(2)(3)
 */


function plus(a,b,c){
  return a+b+c
}

function curry(fn){
  const len = fn.length
  let args = []
  return function helper(){
    args = args.concat(...arguments)
    if(args.length>=len){
      return fn.apply(null, args)
    }else{
      return helper
    }
  }
}

const add = curry(plus)

console.log(add(1)(2)(3))
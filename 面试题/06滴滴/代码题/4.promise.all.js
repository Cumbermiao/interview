// Promise.all=function(){/*TODO*/} 
// Promise.all([])
// Promise.all([123, null,undefined]).then(res=>{
//   console.log(res) // [123, null,undefined]
// })


const promiseAll = function(promises){
  const results = [];
  let done = 0;

  function myResolve(val){
    let res = val
    if(typeof val === 'function'){
      res = val()
    }
    return new Promise((resolve,reject)=>{
      resolve(res)
    })
  }

  return new Promise((resolve,reject)=>{
    if(promises===undefined || !promises.length){
      return resolve([])
    }
    promises.forEach((val,idx)=>{
      myResolve(val).then(res=>{
        results[idx] = res
        done++;
        if(done === promises.length){
          return resolve(results)
        }
      })
    })
  })

  

  
}

promiseAll([]).then(res=>{console.log(res)})
promiseAll([123, null,undefined]).then(res=>{console.log(res)})
promiseAll([
  function(){
    return new Promise((resolve,reject)=>{
      setTimeout(function(){
        resolve(1)
      },1000)
    })
  },
  function(){
    return 2
  },
  Promise.resolve(3),
  4
]).then(res=>{
  console.log(res)
})
// const flat = function(arr){
//  return arr.reduce((prev,cur)=>{
//    console.log(prev)
//    if(Array.isArray(cur)){
//      prev = prev.concat(flat(cur))
//    }else{
//      prev.push(cur)
//    }
//    return prev

//  },[]) 
// }


//简易写法
const flat = arr=>arr.reduce((prev,cur)=>prev.concat(Array.isArray(cur)?flat(cur):cur),[])

// @test

console.log(flat([1,[2,[3,[4,5]]],6,[7,8]]))
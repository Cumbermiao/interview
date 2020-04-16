// 数组 flat 实现

function flat(arr,depth){
  var flatOnce = function(arr){
      //1 reduce
      return arr.reduce((prev,cur)=>{
        if(Array.isArray(cur)){
          return prev.concat(cur)
        }
        return [...prev,cur]
      },[])

      //2 for 遍历
      // let res = [];
      // for(let i=0;i<arr.length;i++){
      //     if(Array.isArray(arr[i])){
      //         res.push(...arr[i])
      //     }else{
      //         res.push(arr[i])
      //     }
      // }
      // return res
  }

  let res = arr.slice(0);
  let i=0;
  while(i<depth){
      res = flatOnce(res);
      i++;
  }
  return res
}

var num1=[1,2,[3,4],5];
var num2=[[1,2,[3,4]],5];
var num3=[[1,[2,[3,[4],5]]]];

console.log(flat(num1,1))
console.log(flat(num1,2))
console.log(flat(num2,1))
console.log(flat(num2,2))
console.log(flat(num2,3))
console.log(flat(num3,1))
console.log(flat(num3,2))
console.log(flat(num3,3))
console.log(flat(num3,4))

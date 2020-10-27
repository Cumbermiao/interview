function transform(matrix){
  return matrix.map(arr=>{
    return arr.map(num=>Number(!num)).reverse()
  })
}

console.dir(transform([[1,1,0],[1,0,1],[0,0,0]]))
console.dir(transform([[1,1,0,0],[1,0,0,1],[0,1,1,1],[1,0,1,0]]))
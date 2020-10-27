const arr2BinaryTree = function(arr){
  if(arr.length){
    const root = new treeNode(arr.shift())
    const nodes = []
    nodes.push(root)
    while(nodes.length&&arr.length){
      node = nodes.shift()
      const [left,right]=arr.splice(0,2)
      if(left!==null){
        let lNode = new treeNode(left)
        node.left = lNode
        nodes.push(lNode)
      }
      if(right!==null){
        let rNode = new treeNode(right)
        node.right = rNode
        nodes.push(rNode)
      }
    }
    return root
  }
  return null
}

const treeNode = function(val){
  this.val = val
  this.left = null
  this.right = null
}

console.log(arr2BinaryTree([1,2,3,4,null,null,5,6,7,null,8]))
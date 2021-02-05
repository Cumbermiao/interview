//9
// function some(root, val = "phone") {
//   const search = function (queue = [root]) {
//     let node = queue.shift();
//     while (node) {
//       if (node.value === val) return node;
//       else {
//         node.children && node.children.length && queue.push(...node.children);
//         node = queue.shift();
//       }
//     }
//     return false;
//   };

//   return search();
// }
function bfs(root, val = "phone") {
  const queue = [root]
  let node = queue.shift();
  while (node) {
    if (node.value === val) return node;
    else {
      node.children && node.children.length && queue.push(...node.children);
      node = queue.shift();
    }
  }
  return false;
}

const root1 = null;
const root2 = {
  value: "a",
  children: [{ value: "b", children: [{ value: "c", children: [] }] }],
};

const root3 = {
  value: "a",
  children: [
    { value: "b", children: [] },
    {
      value: "c",
      children: [
        {
          value: "d",
          children: [],
        },
      ],
    },
  ],
};

// console.log(bfs(root1, "c"));
// console.log(bfs(root2, "c"));
// console.log(bfs(root3, "d"));

// 39

function Node(key) {
  this.value = key;
  this.left = null;
  this.right = null;
}

function insert(root, key) {
  const node = new Node(key);
  if (root === null) root = node;
  else {
    insertNode(root, node);
  }
  console.log(root);
}

function insertNode(node, insert) {
  if (insert.value < node.value) {
    if (node.left === null) {
      node.left = insert;
    } else {
      insertNode(node.left, insert);
    }
  } else {
    if (node.right === null) {
      node.right = insert;
    } else {
      insertNode(node.right, insert);
    }
  }
}

// var r1 = null
// insert(r1, 10)

// var r2 = new Node(4)
// var n1 = new Node(2)
// r2.left = n1
// r2.right = new Node(7)
// n1.left = new Node(1)
// n1.right = new Node(3)
// insert(r2, 5)

// 67
const request = (url, cb) => {
  console.log("request");
  setTimeout(() => {
    cb(`data from ${url}`);
  }, 100);
};

const pool = new Map();

function Cache(url, pending = true){
  this.url = url
  this.pending = pending
  this.data = undefined
  this.cbs = []
}


function cacheRequest(url, cb) {
  if (pool.has(url)) {
    const { pending, cbs, data } = pool.get(url)
    if(pending){
      cbs.push(cb)
    }else{
      setTimeout(()=>{
        cb(data)
      })
    }
  } else {
    const cache = new Cache(url)
    cache.cbs.push(cb)
    pool.set(url, cache);
    request(url, (data) => {
      cache.pending = false
      cache.data = data
      if(cache.cbs.length){
        cache.cbs.forEach(cb=>cb(data))
      }
    });
  }
}

// cacheRequest("/123", (data) => console.log(data));
// cacheRequest("/456", (data) => console.log(data));
// cacheRequest("/123", (data) => console.log(data));
// cacheRequest("/123", (data) => console.log(data));
// cacheRequest("/123", (data) => console.log(data));

// setTimeout(() => {
//   cacheRequest("/456", (data) => console.log(data));
// }, 1000);

// 89
function lottery(whiteList,  participant, count=20000) {
  const res = []
  whiteList.sort((a,b)=>a-b)
  participant.sort((a,b)=>a-b)

  const pickRandom = ()=>{
    const idx = parseInt(Math.random() * participant.length)
    res.push(participant.splice(idx, 1)[0])
  }

  let i1 = 0
  let i2 = 0
  while(res.length<count){
    if(i1<whiteList.length && i2<participant.length){
      if(whiteList[i1] === participant[i2]){
        let [ele] = participant.splice(i2,1)
        res.push(ele)
        i1++
      }else if(whiteList[i1] > participant[i2]){
        i2++
      }else {
        i1++
      }
    }else{
      pickRandom()
    }
  }

  return res
}

const w1 = [1,2,3,4,5,6,7,8,11]
const p1 = [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31]
console.log(lottery(w1, p1, 10))

const random = (min=0, max=200)=>parseInt(Math.random()*max + min)

const w2 = []
for(let i=0;i<20;i++){
  if(i<10){
    w2.push(random(0,50))
  }else{
    w2.push(random(50, 100))
  }
  
}

// const p2 = []
// for(let i=0;i<60;i++){
//   if(i<30){
//     p2.push(random(0,150))
//   }else{
//     p2.push(random(200, 1000))
//   }
// }

// console.log(w2.sort((a,b)=>a-b))
// console.log(p2.slice(0).sort((a,b)=>a-b))
// console.log(lottery(w2, p2, 20))

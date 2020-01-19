/**
 * TODO: require modules 路径作为key 有问题
 * F:codeinterviewminipacksourcemain.js: ƒ (exports,require)
 * F:codeinterviewminipacksourceminus.js: ƒ (exports,require)
 * F:codeinterviewminipacksourceplus.js: ƒ (exports,require)
 *  */

const fs = require('fs');
const path = require('path');
const util = require('util');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse');
const {transformFileSync,transformFromAst}  = require('@babel/core');

// UNFINISHED: start
// var id = 0;

// function deepCreate(filePath,id=1){
//   const dep=[];
//   if (!path.isAbsolute(filePath)) filePath = path.resolve(__dirname, filePath);
//   const dirPath = path.dirname(filePath);
//   const content = fs.readFileSync(filePath, 'utf-8');
//   const ast = babelParser.parse(content,{
//     sourceType:'module'
//   });
//   let cp = id;
//   traverse.default(ast,{
//     ImportDeclaration:function({node}){
//       cp++;
//       node.source.value = path.resolve(dirPath,node.source.value);
//       dep.push(deepCreate(node.source.value,cp))
//     },
//     CallExpression ({ node }) {
//       if (node.callee.name === 'require') {
//         cp++;
//         node.arguments[0].value = `${path.resolve(dirPath, node.arguments[0].value)}`;
//         dep.push(deepCreate(node.arguments[0].value,cp));
//       }
//     }
//   })
//   return {
//     filePath,
//     dependencies:dep
//   }
// }

// function replacePathWithId(filePath){
//   if (!path.isAbsolute(filePath)) filePath = path.resolve(__dirname, filePath);
//   const dirPath = path.dirname(filePath);
//   let obj;
//   const visitor = {
//     // import 
//     // ImportDeclaration ({ node }) {
//     //   console.log('import--------',path.resolve(dirPath,node.source.value))
//     //   replacePathWithId(path.resolve(dirPath,node.source.value))
//     // },

//     // 添加 require() 语法支持
//     CallExpression ({ node }) {
//       if (node.callee.name === 'require') {
//         console.log('require--------',path.resolve(dirPath,node.arguments[0].value))
//         let temp = path.resolve(dirPath,node.arguments[0].value)
//         modules.forEach(item=>{
//           if(item.filePath==temp){
//             node.arguments[0].value = item.id
//             obj = item;
//             console.log('fix')
//           }
//         })
//         replacePathWithId(temp)
//       }
//     }
//   }
//   const { code } = transformFileSync(filePath, {
//     presets: ['@babel/env'],
//     plugins: [{
//       visitor
//     }]
//   })
//   console.log('---',obj)
//   obj&&(obj.code = code);
// }

// let depGraph = deepCreate('../source/main.js');
// let modules = flattenGraph(depGraph);
// replacePathWithId(modules[0].filePath)
// const bundle = createBundle(modules)
// console.log(bundle)
// fs.writeFile(
//   'dist/bundle.js',
//   new Uint8Array(Buffer.from(bundle), err => {
//     if (err) console.log(err);
//     else {
//       console.log('===========success==================');
//     }
//   })
// );
// UNFINISHED: end



let id = 0; // moduleId

let moduledPath = [];//cache all filePath already have an id

function createModuleGraph(filePath){
  let exist = moduledPath.filter(item=>item.filePath===filePath);
  if(exist.length)return {...exist[0],exist:true}
  const dep=[];
  const content = fs.readFileSync(filePath, 'utf-8');
  const ast = babelParser.parse(content,{
    sourceType:'module'
  });
  traverse.default(ast,{
    ImportDeclaration:function({node}){
      dep.push(node.source.value)
    },
    CallExpression ({ node }) {
      if (node.callee.name === 'require') {
        dep.push(node.arguments[0].value);
      }
    }
  })
  let moduleId = id++;
  const { code } = transformFromAst(ast, null, {
    presets: ['@babel/env']
  });

  moduledPath.push({filePath,id:moduleId});

  return {
    id:moduleId,
    filePath,
    dependencies:dep,
    code
  }
}
let mainGraph = createModuleGraph('../source/main.js');
let modules = [mainGraph];
for(let graph of modules){
  graph.map = {};
  const dirname = path.dirname(graph.filePath);
  graph.dependencies.forEach(rePath=>{
    let absPath = path.join(dirname,rePath);
    let m = createModuleGraph(absPath);
    graph.map[rePath] = m.id;
    if(!("exist" in m)){
      modules.push(m);
    }
  })
}


const bundle = createBundle(modules);
fs.writeFile(
  'dist/bundle.js',
  new Uint8Array(Buffer.from(bundle), err => {
    if (err) console.log(err);
    else {
      console.log('===========success==================');
    }
  })
);


/**
 * @description 从入口文件开始解析依赖(import), 生成依赖树
 * @param {string} filePath 解析的文件路径
 */
function createGraph (filePath) {
  if (!path.isAbsolute(filePath)) filePath = path.resolve(__dirname, filePath);
  const dirPath = path.dirname(filePath)

  const dependencies = []

  const visitor = {
    // import 
    ImportDeclaration ({ node }) {
      node.source.value = path.resolve(dirPath, node.source.value);
      id++;
      let dep = createGraph(node.source.value);
      if(dep&&!checkExistInDep(dependencies,dep.path)){
        dependencies.push(dep)
      }else{
        id--
      }
      // dependencies.push(createGraph(node.source.value))
    },

    // 添加 require() 语法支持
    // CallExpression ({ node }) {
    //   if (node.callee.name === 'require') {
    //     let exist = checkExistInDep(dependencies,path.resolve(dirPath, node.arguments[0].value));
    //     if(exist){
    //       node.arguments[0].value = exist.id;
    //     }else{
          
    //     }
    //     node.arguments[0].value = `${path.resolve(dirPath, node.arguments[0].value)}`

    //     dependencies.push(createGraph(node.arguments[0].value))
    //   }
    // }
  }

  const { code } = transformFileSync(filePath, {
    presets: ['@babel/env'],
    plugins: [{
      visitor
    }]
  })

  return {
    id,
    filePath,
    code,
    dependencies
  }
}

/**
 * @description 检测 dependencies 中是否已经存在 path 依赖
 * @param {array} dep 
 * @param {string} path 
 */
function checkExistInDep(dep,path){
  for(let i=0;i<dep.length;i++){
    if(dep.filePath===path)return dep[i]
  }
  return false
}

/**
 * @description 扁平化 graph
 * @param {object} graph 
 * @param {array} modules 
 * @returns {array}
 */
function flattenGraph(graph,modules=[]){
  let exist = modules.filter(item=>item.filePath==graph.filePath);
  if(exist.length)return;
  modules.push({id:id,filePath:graph.filePath, code:graph.code});
  for(let i=0;i<graph.dependencies.length;i++){
    id++;
    flattenGraph(graph.dependencies[i],modules)
  }
  return modules
}

/**
 * 
 * @param {modules} modules 
 */
function createBundle(modules){
  return `(function(modules){
    const installedModules = {};
    console.log(modules);
    function require(moduleId){
      if(installedModules[moduleId]){
        return installedModules[moduleId].exports
      }
      var module = (installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      })

      const [fn,map] = modules[moduleId]
      
      function localRequire(name){
        console.log(name,map[name],map)
        return require(map[name])
      }

      fn.call(
        module.exports,
        module,
        module.exports,
        localRequire
      )
      // modules[moduleId](module.exports,require)
      return module.exports
    }
    require(0)
  })({${modules.map(item=>{
    return (`"${item.id}":[${wrapSource(item.code)},${util.inspect(item.map)}]`)
  })}})`
}

function wrapSource(code){
  return (`(function (module,exports,require){
    ${code}
  })`)
}

// let ast = createGraph('../source/main.js');
// let modules = flattenGraph(ast);
// // let modulesObj = {};
// // for(let i=0;i<modules.length;i++){
// //   modulesObj[modules[i].id] = wrapSource(modules[i].code)
// // }
// console.log(modules)



// const bundle = createBundle(modules);
// fs.writeFile(
//   'dist/bundle.js',
//   new Uint8Array(Buffer.from(bundle), err => {
//     if (err) console.log(err);
//     else {
//       console.log('===========success==================');
//     }
//   })
// );




//2
// const fs = require('fs')
// const path = require('path')
// const { transformFileSync } = require('@babel/core')

// /**
//  * 读取资源文件，修改 import 语句，ES6 import/export 语法转换成 require/exports 的形式，并生成依赖图
//  * @param {string} filePath - 资源文件路径
//  */
// function createGraph (filePath) {
//   if (!path.isAbsolute(filePath)) filePath = path.resolve(__dirname, filePath)
//   const dirPath = path.dirname(filePath)

//   const dependencies = []

//   const visitor = {
//     // 我们要修改的节点是 import 声明节点。
//     ImportDeclaration ({ node }) {
//       node.source.value = path.resolve(dirPath, node.source.value)
//       dependencies.push(createGraph(node.source.value))
//     },

//     // 添加 require() 语法支持
//     CallExpression ({ node }) {
//       if (node.callee.name === 'require') {
//         node.arguments[0].value = path.resolve(dirPath, node.arguments[0].value)
//         dependencies.push(createGraph(node.arguments[0].value))
//       }
//     }
//   }

//   const { code } = transformFileSync(filePath, {
//     presets: ['@babel/env'],
//     plugins: [{
//       // babel 提供的访问者模式
//       visitor
//     }]
//   })

//   return {
//     filePath,
//     code,
//     dependencies
//   }
// }

// /**
//  * 递归遍历，将依赖图展开成平级的数组
//  * @param {object} graph - 依赖图
//  * @param {array} modules - 展开后的数组
//  */
// function flattenGraph (graph, modules = []) {
//   // 这里将文件的绝对路径作为 module 的id
//   modules.push({ id: graph.filePath, code: graph.code })
//   if (graph.dependencies.length) {
//     graph.dependencies.forEach(o => {
//       flattenGraph(o, modules)
//     })
//   }
//   return modules
// }

// /**
//  * 生成入口文件，拼接模块数组
//  * @param {array} modules 模块数组
//  */
// function createBundle (modules) {
//   return `(function (modules) {
//     console.log(modules)
//     function require(moduleId) {
//         let module = {
//           exports:{}
//         };
//         modules[moduleId](module, module.exports, require);
//         return module.exports;
//     }
//     require("${modules[0].id}")
// })({${modules.map(module =>
//     (`"${module.id}":${generateModuleTemplate(module.code)}`))}})`
// }

// function generateModuleTemplate (code) {
//   return `function (module, exports, require) {
//     ${code}
// }`
// }

// function generateFile (str) {
//   fs.writeFileSync('./dist/bundle.js', str)
// }

// function webpackMini (fileEntry) {
//   const graph = createGraph(fileEntry)
//   // console.log(graph);
//   const modules = flattenGraph(graph)
//   // console.log(modules);
//   const bundle = createBundle(modules)
//   // console.log(bundle);
//   generateFile(bundle)
// }

// webpackMini('../source/main.js')


//3
// const fs = require('fs')
// const path = require('path')
// const { transformFileSync } = require('@babel/core')

// /**
//  * 读取资源文件，修改 import 语句，ES6 import/export 语法转换成 require/exports 的形式，并生成依赖图
//  * @param {string} filePath - 资源文件路径
//  */
// function createGraph (filePath, moduleMap = {}) {
//   if (moduleMap[filePath]) return moduleMap[filePath]

//   const module = moduleMap[filePath] = {}
//   const dirPath = path.dirname(filePath)
//   const dependencies = []

//   const visitor = {
//     // 我们要修改的节点是 import 声明节点。
//     ImportDeclaration ({ node }) {
//       node.source.value = resolveFileName(dirPath, node.source.value)
//       dependencies.push(createGraph(node.source.value, moduleMap))
//     },

//     // 添加 require() 语法支持
//     CallExpression ({ node }) {
//       if (node.callee.name === 'require') {
//         node.arguments[0].value = resolveFileName(dirPath, node.arguments[0].value)
//         dependencies.push(createGraph(node.arguments[0].value, moduleMap))
//       }
//     }
//   }

//   const { code } = transformFileSync(filePath, {
//     presets: ['@babel/env'],
//     plugins: [{
//       // babel 提供的访问者模式
//       visitor
//     }]
//   })

//   module.filePath = filePath
//   module.code = code
//   module.dependencies = dependencies
//   return module
// }

// /**
//  * 递归遍历，将依赖图展开成平级的数组
//  * @param {object} graphItem - 依赖图
//  * @param {array} modules - 展开后的数组
//  */
// function flattenGraph (graphItem, modules = []) {
//   if (graphItem._visited) return modules
//   graphItem._visited = true
//   // 这里将文件的绝对路径作为 module 的 id
//   modules.push({ id: graphItem.filePath, code: graphItem.code })
//   if (graphItem.dependencies.length) {
//     graphItem.dependencies.forEach(o => {
//       flattenGraph(o, modules)
//     })
//   }
//   return modules
// }

// /**
//  * 生成入口文件，拼接模块数组
//  * @param {array} modules 模块数组
//  */
// function createBundle (modules) {
//   return `(function (modules) {
//     let cachedModules = {};
//     function require(moduleId) {
//         if(cachedModules[moduleId]) return cachedModules[moduleId].exports;
//         let module = cachedModules[moduleId] =  {
//           exports:{}
//         };
//         modules[moduleId].call(module.exports, module, module.exports, require);
//         return module.exports;
//     }
//     require("${modules[0].id}")
// })({${modules.map(module =>
//     (`"${module.id}":${generateModuleTemplate(module.code)}`))}})`
// }

// function generateModuleTemplate (code) {
//   return `function (module, exports, require) {
//     ${code}
// }`
// }

// function generateFile (str) {
//   fs.writeFileSync('./dist/bundle.js', str)
// }

// function resolveFileName (dirname, filePath) {
//   // 补全绝对路径
//   if (!path.isAbsolute(filePath)) filePath = path.resolve(dirname || __dirname, filePath)
//   // 自动添加 .js ，支持不带 .js 后缀引用文件
//   return path.extname(filePath) ? filePath : filePath + '.js'
// }

// function webpackMini (fileEntry) {
//   const graph = createGraph(resolveFileName(__dirname, fileEntry))
//   // console.log(graph);
//   const modules = flattenGraph(graph)
//   // console.log(modules);
//   const bundle = createBundle(modules)
//   // console.log(bundle);
//   generateFile(bundle)
// }

// webpackMini('../source/main.js')


//minipack
// const fs = require('fs');
// const path = require('path');
// const babylon = require('babylon');
// const traverse = require('babel-traverse').default;
// const { transformFromAst } = require('babel-core');

// let ID = 0;

// // We start by creating a function that will accept a path to a file, read
// // its contents, and extract its dependencies.
// function createAsset(filename) {
//   // Read the content of the file as a string.
//   const content = fs.readFileSync(filename, 'utf-8');

//   const ast = babylon.parse(content, {
//     sourceType: 'module'
//   });

//   const dependencies = [];

//   traverse(ast, {
//     ImportDeclaration: ({ node }) => {
//       dependencies.push(node.source.value);
//     }
//   });
//   const id = ID++;
//   const { code } = transformFromAst(ast, null, {
//     presets: ['env']
//   });

//   // Return all information about this module.
//   return {
//     id,
//     filename,
//     dependencies,
//     code
//   };
// }

// function createGraph(entry) {
//   // Start by parsing the entry file.
//   const mainAsset = createAsset(entry);

//   const queue = [mainAsset];

//   for (const asset of queue) {
//     asset.mapping = {};
//     const dirname = path.dirname(asset.filename);

//     asset.dependencies.forEach(relativePath => {
//       const absolutePath = path.join(dirname, relativePath);

//       const child = createAsset(absolutePath);
//       asset.mapping[relativePath] = child.id;
//       queue.push(child);
//     });
//   }
//   return queue;
// }

// function bundle(graph) {
//   let modules = '';

//   graph.forEach(mod => {

//     modules += `${mod.id}: [
//       function (require, module, exports) {
//         ${mod.code}
//       },
//       ${JSON.stringify(mod.mapping)},
//     ],`;
//   });

//   const result = `
//     (function(modules) {
//       console.log(modules)
//       function require(id) {
//         const [fn, mapping] = modules[id];

//         function localRequire(name) {
//           return require(mapping[name]);
//         }

//         const module = { exports : {} };

//         fn(localRequire, module, module.exports);

//         return module.exports;
//       }

//       require(0);
//     })({${modules}})
//   `;

//   // We simply return the result, hurray! :)
//   return result;
// }

// const graph = createGraph('../source/main.js');
// const result = bundle(graph);

// console.log(result);
// fs.writeFile(
//   'dist/bundle.js',
//   new Uint8Array(Buffer.from(result), err => {
//     if (err) console.log(err);
//     else {
//       console.log('===========success==================');
//     }
//   })
// );

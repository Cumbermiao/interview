//TODO: code 全部转成字符串

const fs = require('fs');
const path = require('path');
const util = require('util');
const babelParser = require('@babel/parser');
const {transformFileSync}  = require('@babel/core');

/**
 * @description 从入口文件开始解析依赖(import), 生成依赖树
 * @param {string} filePath 解析的文件路径
 */
function createGraph (filePath) {
  if (!path.isAbsolute(filePath)) filePath = path.resolve(__dirname, filePath);
  const dirPath = path.dirname(filePath)

  const dependencies = []

  const visitor = {
    // 我们要修改的节点是 import 声明节点。
    ImportDeclaration ({ node }) {
      console.log(node)
      node.source.value = path.resolve(dirPath, node.source.value)
      dependencies.push(createGraph(node.source.value))
    }
  }

  const { code } = transformFileSync(filePath, {
    presets: ['@babel/env'],
    plugins: [{
      visitor
    }]
  })
  return {
    filePath,
    code,
    dependencies
  }
}

/**
 * @description 扁平化 graph
 * @param {object} graph 
 * @param {array} modules 
 * @returns {array}
 */
function flattenGraph(graph,modules=[],id=0){
  let exist = modules.filter(item=>item.filePath==graph.filePath);
  if(exist.length)return;
  modules.push({id,filePath:graph.filePath, code:graph.code});
  for(let i=0;i<graph.dependencies.length;i++){
    flattenGraph(graph.dependencies[i],modules,id+1)
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

    function require(moduleId){
      if(installedModules[moduleId]){
        return installedModules[moduleId].exports
      }

      var module = (installedModules[moduleId] = {
        i: moduleId,
        l: false,
        exports: {}
      })

      console.log(moduleId,modules[moduleId])

      // modules[moduleId].call(
      //   module.exports,
      //   module,
      //   module.exports,
      //   require
      // )
      modules[moduleId](module.exports,require)
    }
    require("${modules[0].id}")
  })({${modules.map(item=>(`"${item.id}":${wrapSource(item.code)}`))}})`
}

function wrapSource(code){
  return (`(function (exports,require){
    ${code}
  })`)
}

let ast = createGraph('../source/main.js');
let modules = flattenGraph(ast);
// let modulesObj = {};
// for(let i=0;i<modules.length;i++){
//   modulesObj[modules[i].id] = wrapSource(modules[i].code)
// }
console.log(modules)



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


// webpackMini('../source/main.js')
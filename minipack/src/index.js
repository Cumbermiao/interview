const fs = require('fs');
const path = require('path');
const util = require('util');
const babelParser = require('@babel/parser');
const traverse = require('@babel/traverse');
const {transformFileSync,transformFromAst}  = require('@babel/core');


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

const fs = require('fs');
const template = require('@babel/template').default;

let wrapCode = template(`
console.log(%%FUNC_NAME%%);
%%BODY%%
`)
module.exports = function(babel) {
  let { types: t } = babel;
  return {
    visitor: {
      FunctionDeclaration: {
        enter: path => {
          let body = path.node.body.body;
          if (body.length == 0) return;
          let functionName = (path.node.id && path.node.id.name) || 'unkown function';
          // for(let key in path.node){
          //   console.log(key,path.node[key],"\n------")
          // }
          // try{
          //   console.log(path.__proto__.contructor.name)
          // }catch(err){
          //   console.log(err)
          // }
          // console.log(path.id,'\n-==========----')
          // fs.writeFileSync('util/a.json', new Uint8Array(Buffer.from(JSON.stringify(path))), err => {
          //   if(err)console.log(err);
          //   else console.log('-----write success------')
          // });
          // path.get('body').insertBefore(
          //   t.expressionStatement(
          //     t.callExpression(
          //       t.memberExpression(t.identifier('console'),t.identifier('log')),
          //       [t.stringLiteral(functionName)]
          //     )
          //   )
          // );
          path.get('body').replaceWithMultiple(wrapCode({
            BODY:body,
            FUNC_NAME:t.stringLiteral(functionName)
          }))
        }
      }
    }
  };
};

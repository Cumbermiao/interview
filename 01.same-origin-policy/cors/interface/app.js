const Koa = require('koa');

const app = new Koa();

app.use(async ctx=>{
  ctx.set('Access-Control-Allow-Origin','http://localhost:8080');
  // ctx.set('content-type','text/plain');
  ctx.remove('content-length');
  if(ctx.url==='/'){
    ctx.body = 'hello';
  }
  if(ctx.method==='GET'){
    ctx.body = 'get success';
    ctx.response.set({status:200})
  }
  if(ctx.method === 'POST'){
    ctx.set('content-type','application/json');
    ctx.body = JSON.stringify({
      success:true,
      data:'post success'
    });
  }
  if(ctx.method === 'PUT'){
    ctx.set('Access-Control-Request-Methods','POST,GET,OPTIONS,PUT');
    ctx.set('Access-Control-Request-Headers','content-type');
    ctx.set('content-type','application/json');
    ctx.body = JSON.stringify({
      success:true,
      data:'put success'
    });
  }
  if(ctx.method === 'OPTIONS'){
    ctx.set('Access-Control-Allow-Methods','PUT');
    ctx.set('Access-Control-Allow-Headers','content-type');
    ctx.body = ctx.body = JSON.stringify({
      success:true,
      data:'options success'
    });
  }

  console.log(ctx)
})

app.listen(3000,()=>{
  console.log('listening 3000')
})
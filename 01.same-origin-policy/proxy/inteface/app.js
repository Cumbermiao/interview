const Koa = require('koa');
const app = new Koa();


app.use(async ctx=>{
  console.log(ctx.method,ctx.url)
  if(ctx.method === 'GET'){
    if(ctx.url == '/interface/getData'){
      ctx.body = JSON.stringify({status:'success',data:'get success'})
    }else{
      ctx.body = '504'
    }
    
  }
  if(ctx.method === 'POST'){
    if(ctx.url === '/interface/postData'){
      ctx.body = JSON.stringify({status:'success',data:'post success'})
    }else{
      ctx.body = '504'
    }
  }
})

app.listen(3000,()=>{
  console.log('listening 3000')
})
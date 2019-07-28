const Koa = require('koa');
const app = new Koa();


app.use(async ctx=>{
  console.log(ctx.url)
  if(ctx.url==='/'){
    ctx.set('Content-Type','text/html');
    ctx.body = 'hello';
  }
  if(ctx.method === 'GET'){
    if(ctx.url.match(/getData/)){
      let {jsoncallback} = ctx.query;
      console.log(ctx.query)
      // ctx.response.headers['content-type'] = 'text/javascript';
      ctx.set('Content-Type','text/javascript');
      return ctx.body = `${jsoncallback}({name:'jsonp'})`
      // return ctx.body = ``
    }else{
      ctx.body = '504'
    }
  }
  ctx.body = '404'
})

app.listen(3000,()=>{
  console.log('listening 3000')
})
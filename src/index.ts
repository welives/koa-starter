import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(process.env.NODE_ENV)
  ctx.body = 'Hello World'
})

app.listen(process.env.PORT || 3000)

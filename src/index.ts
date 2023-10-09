import './utils/load-env'
import Koa from 'koa'

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

app.listen(process.env.APP_PORT || 3000)

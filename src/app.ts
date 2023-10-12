import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import router from './core/routes'
const app = new Koa()
app.use(bodyParser())

app.use(router.routes()).use(router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app

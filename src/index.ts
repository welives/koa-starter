import './utils/load-env'
import Koa from 'koa'
import router from './core/routes'
const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

app.listen(process.env.APP_PORT || 3000)

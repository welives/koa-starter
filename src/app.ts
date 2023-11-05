import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { V1Router } from './routes'
const app = new Koa()
app.use(bodyParser())

app.use(V1Router.routes()).use(V1Router.allowedMethods())
app.use(async (ctx, next) => {
  ctx.body = 'Hello World'
})

export default app

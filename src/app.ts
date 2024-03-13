import path from 'node:path'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import Store from 'koa-redis'
import session from 'koa-generic-session'
import { unprotectedRouter, protectedRouter } from './routes'
import { verifyToken, catchError } from './middlewares'
import { setupLogging } from './utils'
import { cron } from './tasks'

const app = new Koa()
setupLogging(app)
// 对session id进行加密用的盐
app.keys = [process.env.SESSION_SECRET ?? 'secret']
app.use(
  session({
    key: process.env.COOKIE_KEY ?? 'koa.sid', // cookie的key, 默认是 koa.sid
    prefix: process.env.SESSION_PREFIX ?? 'koa:sess:', // session数据在redis中的key前缀, 默认是 koa:sess:
    store: Store({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) ?? 6379,
    }) as any,
  })
)

app
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'unpkg.com'],
      },
    })
  )
  .use(cors())
  .use(bodyParser())
  .use(koaStatic(path.resolve(__dirname, '../public')))

app
  .use(catchError) // 注意一定要放在路由的前面加载
  .use(unprotectedRouter.routes())
  .use(unprotectedRouter.allowedMethods())
  .use(
    verifyToken().unless({
      path: [
        /^\/public/,
        /^\/favicon.ico/,
        /^(?!\/api)/,
        /^\/api\/swagger-/,
        /^\/api\/signup/,
        /^\/api\/signin/,
        /^\/api\/token/,
      ],
    })
  )
  .use(protectedRouter.routes())
  .use(protectedRouter.allowedMethods())

// 注册定时任务
cron.start()

export default app

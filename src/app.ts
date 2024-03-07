import path from 'node:path'
import Koa from 'koa'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import koaStatic from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { unprotectedRouter, protectedRouter } from './routes'
import catchError from './middlewares/exception'
import verifyToken from './middlewares/auth'
import { setupLogging } from './utils/logger'
import { cron } from './tasks'

const app = new Koa()
setupLogging(app)

app
  .use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
        styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'online.swagger.io', 'validator.swagger.io'],
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
      path: [/^\/api\/swagger-/, /^\/api\/signin/, /^\/api\/token/, /^\/public/, /^\/favicon.ico/],
    })
  )
  .use(protectedRouter.routes())
  .use(protectedRouter.allowedMethods())

// 注册定时任务
cron.start()

export default app

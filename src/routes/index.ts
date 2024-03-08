import Router from 'koa-router'
import { SwaggerRouter, registry } from 'koa-swagger-decorator'
import GeneralController from '../controllers/general.ctrl'
import AuthController from '../controllers/auth.ctrl'

const unprotectedRouter = new Router()
unprotectedRouter.get('/', new GeneralController().hello)

const protectedRouter = new SwaggerRouter({
  spec: {
    info: {
      title: 'koa-starter',
      description: 'API Doc',
      version: '1.0.0',
    },
  },
})
// 开发环境才挂载swagger
if (process.env.NODE_ENV === 'development') {
  protectedRouter.swagger()
}
protectedRouter.prefix('/api')
// 用来指定token存放的位置和key名
registry.registerComponent('securitySchemes', process.env.API_KEY, {
  type: 'apiKey',
  name: process.env.API_KEY,
  in: 'header',
})
protectedRouter.applyRoute(AuthController)

export { unprotectedRouter, protectedRouter }

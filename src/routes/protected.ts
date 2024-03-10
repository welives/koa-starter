import { SwaggerRouter, registry } from 'koa-swagger-decorator'
import AuthController from '../controllers/auth.ctrl'

const protectedRouter = new SwaggerRouter(
  {
    spec: {
      info: {
        title: 'koa-starter',
        description: 'API Doc',
        version: '1.0.0',
      },
    },
  },
  { prefix: '/api' }
)
// 用来指定token存放的位置和key名
registry.registerComponent('securitySchemes', process.env.API_KEY ?? 'authorization', {
  type: 'apiKey',
  name: process.env.API_KEY ?? 'authorization',
  in: 'header',
})
protectedRouter.applyRoute(AuthController)
// 开发环境才挂载swagger
if (process.env.NODE_ENV === 'development') {
  protectedRouter.swagger()
}

export { protectedRouter }

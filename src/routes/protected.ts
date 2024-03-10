import path from 'node:path'
import { SwaggerRouter } from 'koa-swagger-decorator'

const protectedRouter = new SwaggerRouter(
  { prefix: '/api' }, // RouterOptions
  { title: 'koa-starter', description: 'API DOC', version: '1.0.0', prefix: '/api' } // SwaggerOptions
)

// 扫描控制器模块并禁用内置的参数校验
protectedRouter.mapDir(path.resolve(__dirname, '../controllers'), { doValidation: false })

// 开发环境才挂载swagger
if (process.env.NODE_ENV === 'development') {
  protectedRouter.swagger()
}

export { protectedRouter }

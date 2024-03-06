import path from 'node:path'
import Router from 'koa-router'
import { SwaggerRouter } from 'koa-swagger-decorator'
import GeneralController from '../controllers/general.controller'
import AuthController from '../controllers/auth.controller'

const unprotectedRouter = new Router()
unprotectedRouter.get('/', GeneralController.hello)

const protectedRouter = new SwaggerRouter()
protectedRouter.swagger({
  title: 'koa-starter',
  description: 'API Doc',
  version: '1.0.0',
  prefix: '/api',
})
protectedRouter.mapDir(path.resolve(__dirname, '../'))

protectedRouter.prefix('/api')
protectedRouter.post('/signin', AuthController.signIn)
protectedRouter.post('/token', AuthController.token)
protectedRouter.delete('/logout', AuthController.logout)

export { unprotectedRouter, protectedRouter }

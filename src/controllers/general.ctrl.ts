import { Context } from 'koa'
import { routeConfig } from 'koa-swagger-decorator'
export default class GeneralController {
  @routeConfig({
    method: 'get',
    path: '/',
    summary: '欢迎页',
    tags: ['General'],
  })
  async hello(ctx: Context) {
    ctx.body = 'Hello World!'
  }
}

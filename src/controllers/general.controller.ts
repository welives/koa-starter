import { Context } from 'koa'
import { request, summary, tagsAll } from 'koa-swagger-decorator'

@tagsAll(['General'])
export default class GeneralController {
  @request('get', '')
  @summary('欢迎页面')
  static async hello(ctx: Context) {
    ctx.body = 'Hello World!'
  }
}

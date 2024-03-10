import { IRouterContext } from 'koa-router'
import { request, summary, query, tagsAll } from 'koa-swagger-decorator'
import { redis } from '../utils/redis'

@tagsAll(['General'])
export default class GeneralController {
  @request('get', '')
  @summary('欢迎页')
  @query({
    name: { type: 'string', required: false, example: 'jandan' },
  })
  async hello(ctx: IRouterContext) {
    // 提取cookies中的session id
    const sid = ctx.cookies.get(process.env.COOKIE_KEY ?? 'koa.sid')
    console.log('sid', sid)
    // session prefix 拼接sid得到key
    const session_key = `${process.env.SESSION_PREFIX ?? 'koa:sess:'}${sid}`
    console.log('session_key', session_key)
    const data = await redis.get(session_key)
    console.log('data', data)
    ctx.session.name = ctx.request.query.name
    if (ctx.session.viewCount === null || ctx.session.viewCount === undefined) {
      ctx.session.viewCount = 1
    } else {
      ctx.session.viewCount++
    }
    ctx.body = `Hello ${ctx.session.name}, you check this ${ctx.session.viewCount} times`
  }
}
export const generalController = new GeneralController()

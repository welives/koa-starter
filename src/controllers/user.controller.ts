import { Context } from 'koa'

export default class UserController {
  public static async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: { name: 'jandan', email: '10000@qq.com' },
    }
  }
}

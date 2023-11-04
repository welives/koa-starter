import { Context } from 'koa'
const singletonEnforcer = Symbol('UserController')
class UserController {
  private static _instance: UserController
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
  }
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    this._instance || (this._instance = new UserController(singletonEnforcer))
    return this._instance
  }
  async getUser(ctx: Context) {
    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: { name: 'jandan', email: '10000@qq.com' },
    }
  }
}
export default UserController.instance

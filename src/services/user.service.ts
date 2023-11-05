import { Context } from 'koa'
import userModel from '../schemas/user.schema'

const singletonEnforcer = Symbol('UserService')

class UserService {
  private static _instance: UserService
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
  }
  static get instance() {
    this._instance || (this._instance = new UserService(singletonEnforcer))
    return this._instance
  }
  async getUser(ctx?: Context) {
    const users = await userModel.find({})
    return users
  }
}
export default UserService.instance

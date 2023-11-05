import { Context } from 'koa'
import DBSource from '../config/db'

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
    const userRepository = DBSource.getRepository('user')
    const users = await userRepository.find()
    return users
  }
}
export default UserService.instance

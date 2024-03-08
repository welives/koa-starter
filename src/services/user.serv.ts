import bcrypt from 'bcryptjs'
import UserRepository, { User } from '../schemas/user.schema'
import { BaseService } from './base.serv'

class UserService extends BaseService<User> {
  Repository = UserRepository
  async findByNameOrEmail(username: string, email: string) {
    return this.Repository.findOne({ $or: [{ username }, { email }] })
  }
  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }
}
export default new UserService()

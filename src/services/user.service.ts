import bcrypt from 'bcryptjs'
import UserRepository from '../schemas/user.schema'
import { BaseService } from './base.service'
import { UserDto } from '../dto/user'

class UserService extends BaseService<UserDto> {
  Repository = UserRepository
  async findByNameOrEmail(username: string, email: string): Promise<UserDto> {
    return await this.Repository.findOne({ $or: [{ username }, { email }] })
  }
  comparePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash)
  }
}
export default new UserService()

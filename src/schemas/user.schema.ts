import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { UserDto } from '../dto/user'

type UserDocument = mongoose.Document & UserDto

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { versionKey: false }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    console.log(salt)
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
const UserRepository = mongoose.model<UserDocument>('User', userSchema, 'user')
export default UserRepository

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dayjs from 'dayjs'

export interface User {
  id: string
  username: string
  password: string
  email: string
  lock_token?: string
  comparePassword(password: string): boolean
}

type UserDocument = mongoose.Document & User

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
    lock_token: {
      type: String,
      default: null,
    },
    createdAt: Number,
    updatedAt: Number,
  },
  { versionKey: false, timestamps: { currentTime: () => Date.now() } }
)

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})
userSchema.virtual('gmt_created').get(function () {
  return dayjs(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
})
userSchema.virtual('gmt_updated').get(function () {
  return dayjs(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
})
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.password)
}

// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
const UserRepository = mongoose.model<UserDocument>('User', userSchema, 'user')
export default UserRepository

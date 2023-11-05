import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false }
)
// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
const userModel = mongoose.model('User', userSchema, 'user')
export default userModel

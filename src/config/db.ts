import mongoose from 'mongoose'

const url = process.env.MONGODB_URL as string

mongoose.connect(url)

mongoose.connection.on('connected', () => {
  console.log('数据库连接成功')
})
mongoose.connection.on('error', (err) => {
  console.error('数据库连接失败', err)
})
mongoose.connection.on('disconnected', () => {
  console.log('数据库连接已断开')
})

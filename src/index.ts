import './env'
require('require-context/register')
import 'reflect-metadata'
import app from './app'
import DBSource from './config/db'
const PORT = process.env.APP_PORT || 3000

DBSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log('数据库连接成功')
      console.info('Server listening on port: ' + PORT)
    })
  })
  .catch((err) => {
    console.error('数据库连接失败', err)
    process.exit(1)
  })

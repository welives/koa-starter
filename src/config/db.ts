import { DataSource, DataSourceOptions } from 'typeorm'
// 自动加载所有模型
const moduleFiles = require.context('../models', true, /\.(ts|js)$/)
const models = moduleFiles.keys().reduce((model: any[], modelPath: string) => {
  const value = moduleFiles(modelPath)
  // 单个导出时
  // const [entity] = Object.values(value).filter((v) => typeof v === 'function' && v.toString().slice(0, 5) === 'class')
  // 默认导出时 [...model, value.default]
  return [...model, value.default]
}, [])
const MYSQL_URL = process.env.MYSQL_URL

const config: DataSourceOptions = {
  ...(MYSQL_URL
    ? { url: MYSQL_URL }
    : {
        host: process.env.MYSQL_HOST as string,
        port: parseInt(process.env.MYSQL_PORT as string),
        username: process.env.MYSQL_USER as string,
        password: process.env.MYSQL_PASSWORD as string,
        database: process.env.MYSQL_DBNAME as string,
      }),
  type: 'mysql',
  timezone: process.env.TIMEZONE,
  charset: process.env.CHARSET,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities: models,
}

const DBSource = new DataSource(config)
export default DBSource

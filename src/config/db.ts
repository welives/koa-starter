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
const MONGODB_URL = process.env.MONGODB_URL

const config: DataSourceOptions = {
  ...(MONGODB_URL
    ? { url: MONGODB_URL }
    : {
        host: process.env.MONGODB_HOST as string,
        port: parseInt(process.env.MONGODB_PORT as string),
        username: process.env.MONGODB_USER as string,
        password: process.env.MONGODB_PWD as string,
        database: process.env.MONGODB_DBNAME as string,
      }),
  type: 'mongodb',
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: false,
  entities: models,
}

const DBSource = new DataSource(config)
export default DBSource

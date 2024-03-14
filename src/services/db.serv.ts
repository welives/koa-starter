import { DataSource, DataSourceOptions } from 'typeorm'
const singletonEnforcer = Symbol('DbService')

class DbService {
  private _db: DataSource
  private static _instance: DbService
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
    this.init()
  }
  static get instance() {
    return this._instance || (this._instance = new DbService(singletonEnforcer))
  }
  private init() {
    const MONGODB_URL = process.env.MONGODB_URL
    const config: DataSourceOptions = {
      ...(MONGODB_URL
        ? { url: MONGODB_URL }
        : {
            host: process.env.MONGODB_HOST ?? 'localhost',
            port: Number(process.env.MONGODB_PORT ?? 27017),
            username: process.env.MONGODB_USER ?? 'root',
            password: process.env.MONGODB_PWD ?? 'root',
            database: process.env.MONGODB_DBNAME ?? 'test',
          }),
      type: 'mongodb',
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
      logging: false,
      entities:
        process.env.NODE_ENV === 'development' ? ['src/entities/**/*.entity.ts'] : ['dist/entities/**/*.entity.js'],
    }
    this._db = new DataSource(config)
    this._db
      .initialize()
      .then(() => {
        console.log('数据库连接成功')
      })
      .catch((err) => {
        console.error('数据库连接失败', err)
        process.exit(1)
      })
  }
  get db() {
    return this._db
  }
}
export const db = DbService.instance.db

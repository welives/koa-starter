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
    const MYSQL_URL = process.env.MYSQL_URL
    const config: DataSourceOptions = {
      ...(MYSQL_URL
        ? { url: MYSQL_URL }
        : {
            host: process.env.MYSQL_HOST ?? 'localhost',
            port: Number(process.env.MYSQL_PORT ?? 3306),
            username: process.env.MYSQL_USER ?? 'root',
            password: process.env.MYSQL_PASSWORD ?? 'root',
            database: process.env.MYSQL_DBNAME ?? 'test',
          }),
      type: 'mysql',
      timezone: process.env.TIMEZONE ?? 'Asia/Shanghai',
      charset: process.env.CHARSET ?? 'utf8',
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

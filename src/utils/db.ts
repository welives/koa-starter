import { DataSource, DataSourceOptions } from 'typeorm'

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
  entities: process.env.NODE_ENV === 'development' ? ['src/entities/**/*.entity.ts'] : ['dist/entities/**/*.entity.js'],
}

export const DBSource = new DataSource(config)

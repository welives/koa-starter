import { DataSource, DataSourceOptions } from 'typeorm'

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
  entities: process.env.NODE_ENV === 'development' ? ['src/entities/**/*.entity.ts'] : ['dist/entities/**/*.entity.js'],
}

export const DBSource = new DataSource(config)

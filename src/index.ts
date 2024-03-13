import './env'
import 'reflect-metadata'
import app from './app'
import { logger } from './utils'
const PORT = process.env.APP_PORT ?? 3000
app.listen(PORT, () => {
  logger.info(`
------------
Server Started!
App is running in ${app.env} mode
Logging initialized at ${process.env.LOG_LEVEL ?? 'debug'} level

Http: http://localhost:${PORT}

API Docs: http://localhost:${PORT}/api/swagger-html
API Spec: http://localhost:${PORT}/api/swagger-json
------------
  `)
})

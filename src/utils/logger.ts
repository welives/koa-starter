import { Context, Next } from 'koa'
import winston from 'winston'

function koaLogging() {
  return async (ctx: Context, next: Next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    let logLevel = ''
    if (ctx.status >= 500) {
      logLevel = 'error'
    } else if (ctx.status >= 400) {
      logLevel = 'warn'
    } else if (ctx.status >= 100) {
      logLevel = 'info'
    }
    const msg = `${ctx.method} ${ctx.url} ${ctx.status} ${ms}ms`
    logger.log(logLevel, msg)
  }
}

const options: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL ?? 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
    new winston.transports.File({ level: 'error', dirname: 'logs', filename: 'error.log' }),
  ],
}
export const logger = winston.createLogger(options)
export function setupLogging(app: any) {
  app.use(koaLogging())
}

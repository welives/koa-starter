import { BaseContext, Next } from 'koa'
import { HttpException, AppError } from '../utils/exception'
interface ICatchError extends AppError {
  request?: string
}

/** @description 错误处理中间件 */
export default async (ctx: BaseContext, next: Next) => {
  try {
    await next()
  } catch (error: any) {
    const isHttpException = error instanceof HttpException
    const isDev = process.env.NODE_ENV === 'development'
    // 开发环境时抛出原始错误
    if (isDev && !isHttpException) {
      throw error
    }
    if (!ctx.path.match(/^\/api\/swagger-/) && !ctx.path.match(/^\/favicon.ico/)) {
      if (isHttpException) {
        const errorObj: ICatchError = {
          success: error.success,
          msg: error.msg,
          code: error.code,
          ...(error.success ? { data: error.data } : {}),
          ...(error.success ? {} : { request: `${ctx.method} ${ctx.path}` }),
        }
        ctx.body = errorObj
        ctx.status = error.status
      } else {
        const errorObj: ICatchError = {
          msg: '服务器错误',
          code: 'E9999',
          request: `${ctx.method} ${ctx.path}`,
        }
        ctx.body = errorObj
        ctx.status = 500
      }
    }
  }
}

import { Next } from 'koa'
import { Context } from 'koa-swagger-decorator'
import { validate } from 'class-validator'
import { Failed } from '../utils/exception'

export interface ValidateContext extends Context {
  dto: any
}

interface Type<T = any> extends Function {
  new (...args: any[]): T
}

export default function (DtoClass: Type) {
  return async (ctx: ValidateContext, next: Next) => {
    const params = { ...(ctx.request.body as object), ...ctx.request.query, ...ctx.params }
    const dto = new DtoClass()
    Object.assign(dto, params)
    const errors = await validate(dto)
    if (errors.length > 0) {
      const errMsg = errors
        .map((err) => {
          const msg = Object.values(err.constraints)[0]
          return msg
        })
        .join(';')
      throw new Failed({ msg: errMsg })
    } else {
      ctx.dto = dto
    }
    await next()
  }
}

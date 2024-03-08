import { Context, Next } from 'koa'
import jwt from 'jsonwebtoken'
import { HttpException } from '../utils/exception'
const unless = require('koa-unless')

export default function () {
  const verifyToken = async (ctx: Context, next: Next) => {
    const authzHeader = ctx.request.header.authorization
    const accessToken = authzHeader && authzHeader.split(' ')[1]
    if (!accessToken) {
      throw new HttpException('unauthorized')
    } else {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            throw new HttpException('expired_token', { msg: '令牌过期' })
          } else if (err.name === 'JsonWebTokenError') {
            throw new HttpException('forbidden', { msg: '无效令牌' })
          }
        }
        ctx.state.user = decode
      })
      return next()
    }
  }
  verifyToken.unless = unless
  return verifyToken
}

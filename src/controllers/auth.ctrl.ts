import { Context } from 'koa'
import { routeConfig, body, ParsedArgs } from 'koa-swagger-decorator'
import jwt from 'jsonwebtoken'
import { Success, HttpException, Failed } from '../utils/exception'
import { genToken } from '../utils/utils'
import redis from '../utils/redis'
import UserService from '../services/user.serv'
import { signUpReq, signInReq, tokenReq, ISignUpReq, ISignInReq, ITokenReq } from '../validators'

export default class AuthController {
  @routeConfig({
    method: 'post',
    path: '/signup',
    summary: '注册接口',
    tags: ['Auth'],
  })
  @body(signUpReq)
  async signUp(ctx: Context, args: ParsedArgs<ISignUpReq>) {
    // 1.检查邮箱是否已存在
    if (await UserService.findOne({ email: args.body.email })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = await UserService.save(args.body)
      delete user.password
      const { _id, password, lock_token, ...rest } = user
      const accessToken = genToken(rest)
      const refreshToken = genToken(rest, 'REFRESH', '1d')
      // 2.将token保存到redis中
      await redis.set(`${rest.id}:token`, JSON.stringify([refreshToken]), 24 * 60 * 60)
      throw new Success({ status: 201, msg: '注册成功', data: { user: rest, accessToken, refreshToken } })
    }
  }

  @routeConfig({
    method: 'post',
    path: '/signin',
    summary: '登录接口',
    tags: ['Auth'],
  })
  @body(signInReq)
  async signIn(ctx: Context, args: ParsedArgs<ISignInReq>) {
    const doc = await UserService.findOne({ username: args.body.username })
    // 1.检查用户是否存在
    if (!doc) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!doc.comparePassword(args.body.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const user = doc.toObject({ virtuals: true })
    const { _id, password, lock_token, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens: string[] = JSON.parse(await redis.get(`${rest.id}:token`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await redis.set(`${rest.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'put',
    path: '/token',
    summary: '刷新token',
    tags: ['Auth'],
  })
  @body(tokenReq)
  async token(ctx: Context, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`${user.id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 6.将刷新token保存到redis中
    refreshTokens = refreshTokens.filter((token) => token !== args.body.token).concat([refreshToken])
    await redis.set(`${rest.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'delete',
    path: '/logout',
    summary: '退出',
    tags: ['Auth'],
    security: [{ [process.env.API_KEY ?? 'authorization']: [] }],
  })
  @body(tokenReq)
  async logout(ctx: Context, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await redis.get(`${user.id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== args.body.token)
    // 6.更新redis
    await redis.set(`${user.id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
export const authController = new AuthController()

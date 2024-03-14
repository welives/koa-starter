import { request, summary, body, middlewares, tagsAll } from 'koa-swagger-decorator'
import jwt from 'jsonwebtoken'
import { genToken, Redis, Success, Failed, HttpException } from '../utils'
import { ValidateContext, validator } from '../middlewares'
import { SignUpDto, SignInDto, TokenDto } from '../dto'
import { User } from '../entities/user.entity'
import { db } from '../services/db.serv'

@tagsAll(['Auth'])
export default class AuthController {
  @request('post', '/signup')
  @summary('注册接口')
  @middlewares([validator(SignUpDto)])
  @body({
    username: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123456' },
    email: { type: 'string', required: true, example: 'admin@example.com' },
  })
  async signUp(ctx: ValidateContext) {
    const userRepository = db.getRepository(User)
    // 1.检查邮箱是否已存在
    if (await userRepository.findOne({ where: { email: ctx.dto.email } })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = userRepository.create()
      Object.assign(user, ctx.dto)
      user.hashPassword(ctx.dto.password)
      await userRepository.save(user)
      const { password, lock_token, ...rest } = user
      const accessToken = genToken(rest)
      const refreshToken = genToken(rest, 'REFRESH', '1d')
      // 2.将token保存到redis中
      await Redis.set(`${rest._id}:token`, JSON.stringify([refreshToken]), 24 * 60 * 60)
      throw new Success({ status: 201, msg: '注册成功', data: { user: rest, accessToken, refreshToken } })
    }
  }

  @request('post', '/signin')
  @summary('登录接口')
  @middlewares([validator(SignInDto)])
  @body({
    username: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123456' },
  })
  async signIn(ctx: ValidateContext) {
    const userRepository = db.getRepository(User)
    const user = await userRepository.findOneBy({ username: ctx.dto.username })
    // 1.检查用户是否存在
    if (!user) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!user.comparePassword(ctx.dto.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const { password, lock_token, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 4.拿到redis中的token
    const refreshTokens = JSON.parse(await Redis.get(`${rest._id}:token`)) ?? []
    // 5.将刷新token保存到redis中
    refreshTokens.push(refreshToken)
    await Redis.set(`${rest._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @request('put', '/token')
  @summary('刷新token')
  @middlewares([validator(TokenDto)])
  @body({
    token: { type: 'string', required: true, example: 'asdasd' },
  })
  async token(ctx: ValidateContext) {
    // 1.先检查前端是否有提交token
    if (!ctx.dto.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(ctx.dto.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user._id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(ctx.dto.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 6.将新token保存到redis中
    refreshTokens = refreshTokens.filter((token) => token !== ctx.dto.token).concat([refreshToken])
    await Redis.set(`${rest._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @request('delete', '/logout')
  @summary('退出')
  @middlewares([validator(TokenDto)])
  @body({
    token: { type: 'string', required: true, example: 'asdasd' },
  })
  async logout(ctx: ValidateContext) {
    // 1.先检查前端是否有提交token
    if (!ctx.dto.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(ctx.dto.token, process.env.REFRESH_TOKEN_SECRET ?? 'secret', (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token
    let refreshTokens: string[] = JSON.parse(await Redis.get(`${user._id}:token`)) ?? []
    // 4.再检查此用户在redis中是否有此token
    if (!refreshTokens.includes(ctx.dto.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 5.移除redis中保存的此客户端token
    refreshTokens = refreshTokens.filter((token) => token !== ctx.dto.token)
    await Redis.set(`${user._id}:token`, JSON.stringify(refreshTokens), 24 * 60 * 60)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}
export const authController = new AuthController()

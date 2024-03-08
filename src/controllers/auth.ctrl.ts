import { Context } from 'koa'
import { routeConfig, body, ParsedArgs } from 'koa-swagger-decorator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Success, HttpException } from '../utils/exception'
import { genToken } from '../utils/utils'
import { signInReq, tokenReq, ISignInReq, ITokenReq } from '../validators'

export default class AuthController {
  // 模拟数据
  readonly username = 'admin'
  readonly password = '$2a$10$D46VTSW0Mpe6P96Sa1w8tebfeYfZf1s.97Dz84XFfpcUvjtSCvLMO'
  static refreshTokens = []
  @routeConfig({
    method: 'post',
    path: '/signin',
    summary: '登录接口',
    tags: ['Auth'],
  })
  @body(signInReq)
  async signIn(ctx: Context, args: ParsedArgs<ISignInReq>) {
    // 1.检查用户是否存在
    if (args.body.username !== this.username) {
      throw new HttpException('not_found', { msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!bcrypt.compareSync(args.body.password, this.password)) {
      throw new HttpException('auth_denied', { msg: '密码错误' })
    }
    // 3.生成token
    const accessToken = genToken({ username: args.body.username })
    const refreshToken = genToken({ username: args.body.username }, 'REFRESH', '1d')
    // 4.将刷新token保存到redis或数据库中
    AuthController.refreshTokens = [refreshToken, ...AuthController.refreshTokens]
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
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token,检查redis或数据库中是否有此token
    if (!AuthController.refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 4.生成新的token
    const { iat, exp, ...rest } = user
    const accessToken = genToken(rest)
    const refreshToken = genToken(rest, 'REFRESH', '1d')
    // 5.将新token保存到redis或数据库中
    AuthController.refreshTokens = AuthController.refreshTokens
      .filter((t) => t !== args.body.token)
      .concat([refreshToken])
    throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
  }

  @routeConfig({
    method: 'delete',
    path: '/logout',
    summary: '退出',
    tags: ['Auth'],
    security: [{ [process.env.API_KEY]: [] }],
  })
  @body(tokenReq)
  async logout(ctx: Context, args: ParsedArgs<ITokenReq>) {
    // 1.先检查前端是否有提交token
    if (!args.body.token) {
      throw new HttpException('unauthorized')
    }
    // 2.解析token中的用户信息
    let user: any
    jwt.verify(args.body.token, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
      }
      user = decode
    })
    // 3.拿到缓存中的token,检查redis或数据库中是否有此token
    if (!AuthController.refreshTokens.includes(args.body.token)) {
      throw new HttpException('forbidden', { msg: '无效令牌，请重新登录' })
    }
    // 4.移除redis或数据库中保存的此客户端token
    AuthController.refreshTokens = AuthController.refreshTokens.filter((token) => token !== args.body.token)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}

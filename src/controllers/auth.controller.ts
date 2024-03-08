import { Context } from 'koa'
import { body, request, summary, tagsAll, routeConfig } from 'koa-swagger-decorator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validate } from 'class-validator'
import {
  AuthException,
  Failed,
  ForbiddenException,
  NotFoundException,
  Success,
  UnauthorizedException,
} from '../utils/exception'
import { genToken } from '../utils/utils'
import { UserDto } from '../dto/user'
import UserService from '../services/user.service'

@tagsAll(['Auth'])
export default class AuthController {
  // 模拟数据
  static readonly username = 'admin'
  static readonly pwd = '$2a$10$D46VTSW0Mpe6P96Sa1w8tebfeYfZf1s.97Dz84XFfpcUvjtSCvLMO'
  static refreshTokens = []

  @request('post', '/signup')
  @summary('注册接口')
  @body({
    username: { type: 'string', required: true, example: 'admin' },
    password: { type: 'string', required: true, example: '123456' },
    email: { type: 'string', required: true, example: '10000@qq.com' },
  })
  static async signUp(ctx: Context) {
    const userDto = new UserDto()
    userDto.username = (ctx.request.body as any).username
    userDto.password = (ctx.request.body as any).password
    userDto.email = (ctx.request.body as any).email
    console.log('==', userDto)
    const errors = await validate(userDto)
    if (errors.length > 0) {
      const msg = Object.values(errors[0].constraints).join(';')
      throw new Failed({ msg })
    } else if (await UserService.findOne({ email: userDto.email })) {
      throw new Failed({ msg: '该邮箱已被注册' })
    } else {
      const user = await UserService.save(userDto)
      delete user.password
      throw new Success({ status: 201, msg: '注册成功', data: user })
    }
  }

  @request('post', '/signin')
  @summary('登录接口')
  @body({
    email: { type: 'string', required: true, example: '10000@qq.com' },
    password: { type: 'string', required: true, example: '123456' },
  })
  static async signIn(ctx: Context) {
    const { username, pwd } = ctx.request.body as any
    // 1.检查用户是否存在
    if (username !== AuthController.username) {
      throw new NotFoundException({ msg: '用户不存在' })
    }
    // 2.校验用户密码
    if (!bcrypt.compareSync(pwd, AuthController.pwd)) {
      throw new AuthException({ msg: '密码错误' })
    }
    // 3.生成token
    const accessToken = genToken({ username })
    const refreshToken = genToken({ username }, 'REFRESH', '1d')
    // 4.将刷新token保存到redis或数据库中
    AuthController.refreshTokens = [refreshToken, ...AuthController.refreshTokens]
    throw new Success({ msg: '登录成功', data: { accessToken, refreshToken } })
  }

  @request('post', '/token')
  @summary('刷新token')
  @body({
    token: { type: 'string', required: true, example: 'abcd' },
  })
  static async token(ctx: Context) {
    const { token } = ctx.request.body as any
    // 1.先检查是否有token
    if (!token) {
      throw new UnauthorizedException({ msg: '缺少令牌' })
    }
    // 2.再检查redis或数据库中是否有此token
    if (!AuthController.refreshTokens.includes(token)) {
      throw new ForbiddenException({ msg: '无效令牌，请重新登录' })
    }
    // 3.最后校验token是否合法
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decode: any) => {
      if (err) {
        throw new ForbiddenException({ msg: '无效令牌，请重新登录' })
      }
      // 4.校验通过的话就生成新的token给客户端
      const accessToken = genToken({ username: decode.username })
      const refreshToken = genToken({ username: decode.username }, 'REFRESH', '1d')
      AuthController.refreshTokens = AuthController.refreshTokens.filter((t) => t !== token).concat([refreshToken])
      throw new Success({ msg: '刷新token成功', data: { accessToken, refreshToken } })
    })
  }

  @request('delete', '/logout')
  @summary('退出')
  @body({
    token: { type: 'string', required: true, example: 'abcd' },
  })
  static async logout(ctx: Context) {
    const { token: refreshToken } = ctx.request.body as any
    // 移除redis或数据库中保存的客户端token
    AuthController.refreshTokens = AuthController.refreshTokens.filter((token) => token !== refreshToken)
    throw new Success({ status: 204, msg: '退出成功' })
  }
}

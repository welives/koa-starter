import { Length, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @Length(4, 20, { message: '用户名长度为4-20' })
  @IsString({ message: '用户名必须为字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @IsString({ message: '密码必须为字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string
}

export class TokenDto {
  @IsString({ message: '令牌必须为字符串' })
  @IsNotEmpty({ message: '令牌不能为空' })
  token: string
}

import { Length, IsEmail, IsNotEmpty } from 'class-validator'

export class UserDto {
  id: string

  @Length(4, 20, { message: '用户名长度为4-20' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @Length(6, 20, { message: '密码长度为6-20' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  comparePassword?: (password: string, cb: (err: any, isMatch: any) => {}) => void
}

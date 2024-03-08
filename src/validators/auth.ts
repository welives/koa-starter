import { z } from 'koa-swagger-decorator'

const signUpReq = z.object({
  username: z
    .string({ required_error: '用户名不能为空' })
    .trim()
    .min(4, '用户名长度不能少于4位')
    .max(20, '用户名长度最多20位'),
  password: z.string({ required_error: '密码不能为空' }).min(6, '密码长度不能少于6位'),
  email: z.string({ required_error: '邮箱不能为空' }).trim().email('邮箱格式不正确'),
})

const signInReq = z.object({
  username: z
    .string({ required_error: '用户名不能为空' })
    .trim()
    .min(4, '用户名长度不能少于4位')
    .max(20, '用户名长度最多20位'),
  password: z.string({ required_error: '密码不能为空' }).min(6, '密码长度不能少于6位'),
})

const tokenReq = z.object({
  token: z.string({ required_error: 'token不能为空' }).trim(),
})

export { signUpReq, signInReq, tokenReq }
export type ISignUpReq = z.infer<typeof signUpReq>
export type ISignInReq = z.infer<typeof signInReq>
export type ITokenReq = z.infer<typeof tokenReq>

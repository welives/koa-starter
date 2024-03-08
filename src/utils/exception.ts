import assert from 'assert'
import Utils from './utils'
export interface AppError {
  // http状态码
  status?: number
  // 业务状态
  success?: boolean
  // 业务消息
  msg?: string
  // 业务码
  code?: string
  // 业务数据
  data?: any
}

export const ErrorType = {
  unknowd: { status: 500, msg: '未知错误', code: 'E9999' },
  http: { status: 400, msg: '请求出错', code: 'E0001' },
  success: { status: 200, msg: 'ok', code: 'E0000' },
  failed: { status: 400, msg: 'error', code: 'E0001' },
  unauthorized: { status: 401, msg: '未授权', code: 'E0002' },
  forbidden: { status: 403, msg: '禁止访问', code: 'E0003' },
  not_found: { status: 404, msg: '资源未找到', code: 'E0004' },
  auth_denied: { status: 400, msg: '身份验证失败', code: 'E0005' },
  parameters: { status: 400, msg: '参数错误', code: 'E0006' },
  expired_token: { status: 422, msg: '令牌过期', code: 'E0007' },
  repeat: { status: 400, msg: '字段重复', code: 'E0008' },
  method_not_allowed: { status: 405, msg: '请求方法不允许', code: 'E0009' },
  file_large: { status: 413, msg: '文件体积过大', code: 'E0010' },
  file_too_many: { status: 413, msg: '文件数量过多', code: 'E0011' },
  file_extension: { status: 406, msg: '文件扩展名不符合规范', code: 'E0012' },
  limit: { status: 400, msg: '请求过于频繁，请稍后再试', code: 'E0013' },
}

type ErrorTypes = keyof typeof ErrorType

export class HttpException extends Error {
  public status: number
  public msg: string
  public code: string
  public success: boolean = false
  public data: any = null
  constructor(type: ErrorTypes = 'http', ex?: AppError) {
    super()
    const error = ErrorType[type]
    this.status = error.status
    this.msg = error.msg
    this.code = error.code
    if (ex && ex.status) {
      assert(Utils.isNumber(ex.status))
      this.status = ex.status
    }
    if (ex && ex.msg) {
      this.msg = ex.msg
    }
    if (ex && ex.code) {
      assert(Utils.isString(ex.code))
      this.code = ex.code
    }
  }
}

/** @description 请求成功 */
export class Success extends HttpException {
  constructor(ex?: AppError) {
    super()
    const error = ErrorType.success
    this.success = true
    this.status = error.status
    this.msg = error.msg
    this.code = error.code
    if (ex && ex.status) {
      assert(Utils.isNumber(ex.status))
      this.status = ex.status
    }
    if (ex && ex.msg) {
      this.msg = ex.msg
    }
    if (ex && ex.code) {
      assert(Utils.isString(ex.code))
      this.code = ex.code
    }
    if (ex && ex.data) {
      this.data = ex.data
    }
  }
}

/** @description 请求失败 */
export class Failed extends HttpException {
  constructor(ex?: AppError) {
    super()
    const error = ErrorType.failed
    this.status = error.status
    this.msg = error.msg
    this.code = error.code
    if (ex && ex.status) {
      assert(Utils.isNumber(ex.status))
      this.status = ex.status
    }
    if (ex && ex.msg) {
      this.msg = ex.msg
    }
    if (ex && ex.code) {
      assert(Utils.isString(ex.code))
      this.code = ex.code
    }
  }
}

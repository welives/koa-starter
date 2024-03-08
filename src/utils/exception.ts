import assert from 'assert'
import Utils from './utils'

export interface AppException {
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

export class HttpException extends Error {
  public status: number = 400
  public success: boolean = false
  public msg: string = '请求错误'
  public code: string = 'E0001'
  public data: any = null
  constructor(ex?: AppException) {
    super()
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
  public status: number = 200
  public msg: string = 'ok'
  public code: string = 'E0000'
  constructor(ex?: AppException) {
    super()
    this.success = true
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
  public msg: string = '请求失败'
  constructor(ex?: AppException) {
    super()
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

export class UnauthorizedException extends HttpException {
  public status: number = 401
  public msg: string = '无效令牌'
  public code: string = 'E0002'
  constructor(ex?: AppException) {
    super()
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

export class ForbiddenException extends HttpException {
  public status: number = 403
  public msg: string = '不可操作'
  public code: string = 'E0003'
  constructor(ex?: AppException) {
    super()
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

export class NotFoundException extends HttpException {
  public status: number = 404
  public msg: string = '资源不存在'
  public code: string = 'E0004'
  constructor(ex?: AppException) {
    super()
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

export class AuthException extends HttpException {
  public msg: string = '校验失败'
  public code: string = 'E0005'
  constructor(ex?: AppException) {
    super()
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

export class ParametersException extends HttpException {
  public msg: string = '参数错误'
  public code: string = 'E0006'
  constructor(ex?: AppException) {
    super()
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

export class ExpiredTokenException extends HttpException {
  public status: number = 422
  public msg: string = '令牌过期'
  public code: string = 'E0007'
  constructor(ex?: AppException) {
    super()
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

export class UnknownException extends HttpException {
  public status: number = 500
  public msg: string = '未知错误'
  public code: string = 'E9999'
  constructor(ex?: AppException) {
    super()
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

export class RepeatException extends HttpException {
  public msg: string = '字段重复'
  public code: string = 'E0008'
  constructor(ex?: AppException) {
    super()
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

export class MethodNotAllowed extends HttpException {
  public status: number = 405
  public msg: string = '请求方法不允许'
  public code: string = 'E0009'
  constructor(ex?: AppException) {
    super()
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

export class RefreshTokenException extends HttpException {
  public status: number = 401
  public msg: string = '令牌刷新失败'
  public code: string = 'E0010'
  constructor(ex?: AppException) {
    super()
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

export class FileLargeException extends HttpException {
  public status: number = 413
  public msg: string = '文件体积过大'
  public code: string = 'E0011'
  constructor(ex?: AppException) {
    super()
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

export class FileTooManyException extends HttpException {
  public status: number = 413
  public msg: string = '文件数量过多'
  public code: string = 'E0012'
  constructor(ex?: AppException) {
    super()
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

export class FileExtensionException extends HttpException {
  public status: number = 406
  public msg: string = '文件扩展名不符合规范'
  public code: string = 'E0013'
  constructor(ex?: AppException) {
    super()
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

export class LimitException extends HttpException {
  public msg: string = '请求过于频繁，请稍后再试'
  public code: string = 'E0014'
  constructor(ex?: AppException) {
    super()
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

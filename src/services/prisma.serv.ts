import { PrismaClient } from '@prisma/client'
const singletonEnforcer = Symbol('PrismaService')

class PrismaService {
  private _prisma: PrismaClient
  private static _instance: PrismaService
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
    this.init()
  }
  static get instance() {
    return this._instance || (this._instance = new PrismaService(singletonEnforcer))
  }
  private init() {
    this._prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'production' ? ['error'] : ['info', 'warn', 'error'],
    })
    this._prisma
      .$connect()
      .then(() => {
        console.log('数据连接成功')
      })
      .catch((err) => {
        console.error('数据连接失败')
        process.exit(1)
      })
  }
  get prisma() {
    return this._prisma
  }
}
export const prisma = PrismaService.instance.prisma

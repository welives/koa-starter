import IoRedis from 'ioredis'

const singletonEnforcer = Symbol('Redis')
class Redis {
  private _client: IoRedis
  private static _instance: Redis
  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize single instance')
    }
    this.init()
    this._client.on('error', (err) => {
      console.error('Redis 连接错误:', err)
      process.exit(1)
    })
    this._client.on('connect', () => console.log('Redis 连接成功'))
    this._client.on('close', () => {
      console.log('Redis 连接断开')
      this._client.connect()
    })
  }
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    return this._instance || (this._instance = new Redis(singletonEnforcer))
  }

  private init() {
    this._client = new IoRedis({
      host: process.env.REDIS_HOST ?? 'localhost',
      port: Number(process.env.REDIS_PORT) ?? 6379,
    })
  }

  get client() {
    return this._client
  }

  // 设置缓存
  async set(key: string, value: string, expire: number) {
    await this._client.set(key, value, 'EX', expire)
  }
  // 获取缓存
  async get(key: string) {
    return this._client.get(key)
  }
  // 删除缓存
  async del(key: string) {
    return this._client.del(key)
  }
  // 更新过期时间
  async expire(key: string, expire: number) {
    return this._client.expire(key, expire)
  }
  async getAllKey(pattern = '*') {
    return this._client.keys(pattern)
  }
}
export default Redis.instance
export const redis = Redis.instance.client

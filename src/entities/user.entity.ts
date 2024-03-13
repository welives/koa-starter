import { Entity, Column, ObjectId, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import bcrypt from 'bcryptjs'

@Entity({ name: 'user' })
export class User {
  @ObjectIdColumn()
  _id: ObjectId
  @Column({ type: 'string', comment: '用户名' })
  username: string
  @Column({ type: 'string', comment: '密码' })
  password: string
  @Column({ type: 'string', unique: true, comment: '邮箱' })
  email: string
  @Column({ type: 'string', comment: '锁定的token', default: null })
  lock_token?: string
  @CreateDateColumn({ type: 'timestamp', comment: '创建时间' })
  createdAt: Date
  @UpdateDateColumn({ type: 'timestamp', comment: '更新时间' })
  updatedAt?: Date

  // 密码加密
  hashPassword(password: string) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync())
  }
  // 密码比对
  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}

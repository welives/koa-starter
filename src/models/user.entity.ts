import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
export enum UserStatus {
  NORMAL = 0, // 正常
  LOCKED = 1, // 锁定
  BANNED = 2, // 封禁
}
// 使用webpack打包时必须要显示声明表名称,否则压缩代码后模型名改变导致自动推断的表名称跟着改变
@Entity({ name: 'user' })
export default class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number
  @Column({ type: 'varchar', comment: '用户名' })
  username: string
  @Column({ type: 'varchar', comment: '密码' })
  password: string
  @Column({ type: 'varchar', comment: '加密盐' })
  salt: string
  @Column({ type: 'varchar', default: '', comment: '头像' })
  avatar: string
  @Column({ type: 'tinyint', default: 0, comment: '角色' })
  role: number
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NORMAL, comment: '状态' })
  status: UserStatus
}

import type { Document, Model } from 'mongoose'

export abstract class BaseService<T> {
  abstract Repository: Model<T & Document>
  async findAll(): Promise<T[]> {
    return (await this.Repository.find().exec()) as T[]
  }

  async findOne(query: any) {
    const res = await this.Repository.findOne(query)
    return res.toObject({ virtuals: true })
  }

  async findById(id: string): Promise<T | null> {
    return (await this.Repository.findById(id).exec()) as T | null
  }

  async save(data: T): Promise<T> {
    const res = await this.Repository.create(data)
    return res.toObject({ virtuals: true })
  }

  async deleteOne(id: string): Promise<{}> {
    return await this.Repository.deleteOne({ _id: id }).exec()
  }
}

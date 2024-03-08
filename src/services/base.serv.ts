import type { Document, Model } from 'mongoose'

export abstract class BaseService<T> {
  abstract Repository: Model<Document & T>
  async findAll() {
    return this.Repository.find()
  }
  async findOne(query: any) {
    return this.Repository.findOne(query)
  }
  async findById(id: string) {
    return this.Repository.findById(id)
  }
  async save(data: any) {
    const doc = await this.Repository.create(data)
    return doc.toObject({ virtuals: true })
  }
  async deleteOne(id: string) {
    return this.Repository.deleteOne({ _id: id })
  }
}

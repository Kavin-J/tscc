import { Database } from '@tscc/core';
import { UserModel } from './user.model';

export class UserRepository {
  constructor(protected db: Database) {}

  async getAll() {
    return await this.db.readAll();
  }
  async get(id: string) {
    return this.db.read(id);
  }
  async create(input: Omit<UserModel,'id'>) {
    return this.db.insert(input);
  }
  async update(input:UserModel) {
    return this.db.update(input);
  }
  async deleteAll(){
    return await this.db.removeAll()
  }
  async delete(id: string) {
    return this.db.delete(id);
  }
}

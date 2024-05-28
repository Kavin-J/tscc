import { Database } from '@tscc/core';

export class UserRepository {
  constructor(protected db: Database) {}

  async getAll() {
    return await this.db.readAll();
  }
}

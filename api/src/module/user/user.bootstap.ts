import { Database, TypedRoutes } from '@tscc/core';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { v4 as uuidv4 } from 'uuid';

export const route = new TypedRoutes();
const db = new Database('users', {
  defaultData: [
    {
      id: uuidv4(),
      username: 'First User',
      password: 'password',
      email: 'a@mail.com',
    },
   
  ],
});
const userRepository = new UserRepository(db);
export const userController = new UserController(userRepository);

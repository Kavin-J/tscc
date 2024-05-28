import { Database } from '@tscc/core';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('users', {
  defaultData: [
    {
      id: uuidv4(),
      user: 'Firstuser',
      password: 'password',
      email: 'a@mail.com',
    },
   
  ],
});
const userRepository = new UserRepository(db);
export const userController = new UserController(userRepository);

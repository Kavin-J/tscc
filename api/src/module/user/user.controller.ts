import type { NextFunction, Request, Response } from 'express';
import { UserRepository } from './user.repository';
import { BaseResponse } from 'core/src/baseResponse';
import { UserModel } from './user.model';
import { route } from './user.bootstap';
import z, { string } from 'zod';

const sampleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  await setTimeout(() => console.log('Midddleware Ja'),3000)
  next();
  
};

export class UserController  /** extends BaseController */ {
  constructor(public userRepository: UserRepository) {
    // super();
  }

  getAll = route.get('/').handler(async () => {
    const allUser = await this.userRepository.getAll();
    return { data: allUser };
  });

  getUser = route
    .get('/:id')
    .params(
      z.object({
        id: z.string(),
      })
    )
    .use(sampleMiddleware)
    .handler(async ({ params }) => {
      return {data:await this.userRepository.get(params.id)} 
    });

  

  create = route
    .post('/')
    .body(
      z.object({
        username: z.string(),
        password: z.string(),
        email: z.string().email(),
      })
    )
    .handler(async ({ body }) => {
      await this.userRepository.create(body);
      return {
        message: 'user created',
      };
    });

  
  updateUser = route
    .put('/:id')
    .params(z.object({
      id:z.string(),
    }))
    .body(z.object({
      username:string(),
      email:string(),
      password:string(),
    }))
    .handler(async ({body,params}) => {
      const user = body
      const id = params.id
      const userUpdated = await this.userRepository.update({...user , id})
      return {
        message:"User update successful",
        data : userUpdated,
      }
    })

    deleteAll = route
      .delete('/')
      .handler(async () => {
        await this.userRepository.deleteAll()
        return {message : 'Deleted all user Successful'}
      })
  async delete(req: Request, res: Response): Promise<BaseResponse<UserModel>> {
    const id = req.params.id;
    await this.userRepository.delete(id);
    return {
      message: 'User has been deleted',
    };
  }
  
}

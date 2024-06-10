import { userController } from './user.bootstap';
import { Router } from '@tscc/core';

const router = new Router();
// router.get('/', userController.getAll);
//  router.post('/', userController.create);
// router.get('/:id', userController.get);
// router.put('/:id', userController.update);
// router.delete('/:id', userController.delete);

// export default new  Router().registerClassRoutes(userController).instance;
export default router.registerClassRoutes(userController).instance

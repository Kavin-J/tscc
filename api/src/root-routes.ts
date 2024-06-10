import type { Request, Response } from 'express';
import express from 'express';
import { userRoutes } from './module/user';


const router = express.Router();

router.use('/users',userRoutes)
router.use('/', (req: Request, res: Response) => {
  res.json({
    massage: 'home',
  });
});

export default router;

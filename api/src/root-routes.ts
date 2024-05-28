import type { Request, Response } from 'express';
import express from 'express';


const router = express.Router();

router.use('/', (req: Request, res: Response) => {
  res.json({
    massage: 'home',
  });
});

export default router;

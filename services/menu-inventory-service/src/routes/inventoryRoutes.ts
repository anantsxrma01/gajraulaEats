import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Inventory route is working' });
});

router.post('/', (req: Request, res: Response) => {
  res.status(201).json({ data: req.body });
});

export default router;

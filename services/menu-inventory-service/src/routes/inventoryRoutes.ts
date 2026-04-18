import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Inventory route is healthy' });
});

router.get('/items', (_req: Request, res: Response) => {
  res.json({ message: 'Inventory items list' });
});

router.post('/items', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Inventory item created', data: req.body });
});

export default router;

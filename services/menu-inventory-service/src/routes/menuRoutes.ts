import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Menu route is healthy' });
});

router.get('/categories', (_req: Request, res: Response) => {
  res.json({ message: 'Menu categories list' });
});

router.post('/categories', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Menu category created', data: req.body });
});

router.get('/items', (_req: Request, res: Response) => {
  res.json({ message: 'Menu items list' });
});

router.post('/items', (req: Request, res: Response) => {
  res.status(201).json({ message: 'Menu item created', data: req.body });
});

export default router;

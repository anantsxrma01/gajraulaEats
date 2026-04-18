import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Order service is healthy' });
});

router.post('/', (req: Request, res: Response) => {
  const orderData = req.body;
  res.status(201).json({ message: 'Order created', order: orderData });
});

export default router;

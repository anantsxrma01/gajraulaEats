import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ message: 'Order service is healthy' });
});

router.post('/create', (req, res) => {
  const orderData = req.body;
  res.status(201).json({ message: 'Order created', order: orderData });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ orderId: id, status: 'pending' });
});

export default router;

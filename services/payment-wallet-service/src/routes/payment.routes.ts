import { Router, Request, Response } from 'express';

const router = Router();

router.get('/status/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({ paymentId: id, status: 'completed' });
});

export default router;
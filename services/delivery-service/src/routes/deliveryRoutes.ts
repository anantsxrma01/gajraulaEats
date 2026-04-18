import { Router } from 'express';
import { DeliveryService } from '../deliveryService';

const router = Router();
const deliveryService = new DeliveryService();

router.post('/assign', async (req, res) => {
  const { orderId, deliveryPartnerId } = req.body;

  try {
    const result = await deliveryService.assignDelivery(orderId, deliveryPartnerId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

router.get('/track/:orderId', async (req, res) => {
  const { orderId } = req.params;

  try {
    const trackingInfo = await deliveryService.trackDelivery(orderId);
    res.status(200).json(trackingInfo);
  } catch (error: any) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;

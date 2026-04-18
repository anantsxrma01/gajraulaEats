import express from 'express';
import { DeliveryService } from './deliveryService';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const deliveryService = new DeliveryService();

app.post('/assign', async (req, res) => {
    const { orderId, deliveryPartnerId } = req.body;
    try {
        const result = await deliveryService.assignDelivery(orderId, deliveryPartnerId);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});

app.get('/track/:orderId', async (req, res) => {
    const { orderId } = req.params;
    try {
        const trackingInfo = await deliveryService.trackDelivery(orderId);
        res.status(200).json(trackingInfo);
    } catch (error: any) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});

app.listen(PORT, () => {
    console.log(`Delivery Service running on port ${PORT}`);
});
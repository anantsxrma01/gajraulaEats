import express from 'express';
import deliveryRoutes from './routes/deliveryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[delivery-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/delivery', deliveryRoutes);

async function startDeliveryService(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log(`✓ Delivery Service is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Delivery Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startDeliveryService();
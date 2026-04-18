import dotenv from 'dotenv';
import express from 'express';
import { json } from 'body-parser';
import orderRoutes from './routes/orderRoutes';
import { connectDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use((req, _res, next) => {
  console.log(`[order-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/orders', orderRoutes);

async function startOrderService(): Promise<void> {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`✓ Order Service is running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Order Service startup failed:', error);
    process.exit(1);
  }
}

startOrderService();


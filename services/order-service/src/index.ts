import dotenv from 'dotenv';
import express from 'express';
import { json } from 'body-parser';
import orderController from './controllers/order.controller';
import { connectDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Mount order controller at root (gateway strips /api/orders prefix)
app.use('/', orderController);

// Alias for backward compatibility
app.use('/orders', orderController);

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


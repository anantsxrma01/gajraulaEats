import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './database';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[payment-service] received ${req.method} ${req.originalUrl}`);
  next();
});

async function startService(): Promise<void> {
  try {
    await connectDatabase();
    app.use('/api/payment', paymentRoutes);

    app.listen(PORT, () => {
      console.log(`Payment & Wallet Service running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startService();
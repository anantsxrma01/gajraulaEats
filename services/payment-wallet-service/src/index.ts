import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './database';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startService(): Promise<void> {
  try {
    await connectDatabase();
    // Mount payment routes at root (gateway strips /api/payment via pathRewrite)
    app.use('/', paymentRoutes);

    app.listen(PORT, () => {
      console.log(`Payment & Wallet Service running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startService();
import dotenv from 'dotenv';
import express from 'express';
import { connectDatabase } from './database';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDatabase()
  .then(() => {
    app.use('/api/payments', paymentRoutes);
    app.listen(PORT, () => {
      console.log(`Payment & Wallet Service running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error('Database connection failed:', error instanceof Error ? error.message : String(error));
  });
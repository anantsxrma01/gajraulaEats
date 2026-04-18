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

app.use('/orders', orderController);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Order Service is running on port ${PORT}`);
    });
  })
  .catch((error: unknown) => {
    console.error('Database connection failed:', error);
  });


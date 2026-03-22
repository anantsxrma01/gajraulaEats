import express from 'express';
import { json } from 'body-parser';
import { OrderController } from './controllers/order.controller';
import { connectDatabase } from './database';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(json());

// Connect to the database
connectDatabase();

// Routes
app.use('/orders', OrderController);

// Start the server
app.listen(PORT, () => {
    console.log(`Order Service is running on port ${PORT}`);
});
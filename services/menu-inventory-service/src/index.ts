import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './database';
import menuRoutes from './routes/menuRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

connectToDatabase()
  .then(() => {
    app.use('/api/menu', menuRoutes);
    app.use('/api/inventory', inventoryRoutes);

    app.listen(PORT, () => {
      console.log(`Menu & Inventory Service running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
  });
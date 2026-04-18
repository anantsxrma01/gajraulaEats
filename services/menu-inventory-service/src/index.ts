import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './database';
import menuRoutes from './routes/menuRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());
app.use((req, _res, next) => {
  console.log(`[menu-inventory-service] received ${req.method} ${req.originalUrl}`);
  next();
});

async function startService(): Promise<void> {
  try {
    await connectToDatabase();
    app.use('/api/menu', menuRoutes);
    app.use('/api/inventory', inventoryRoutes);

    app.listen(PORT, () => {
      console.log(`Menu & Inventory Service running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Service startup failed:', error);
    process.exit(1);
  }
}

startService();
import express from 'express';
import { json } from 'body-parser';
import { connectToDatabase } from './database';
import menuRoutes from './routes/menuRoutes';
import inventoryRoutes from './routes/inventoryRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

async function startService(): Promise<void> {
  try {
    await connectToDatabase();
    app.use('/menu', menuRoutes);
    app.use('/inventory', inventoryRoutes);

    app.listen(PORT, () => {
      console.log(`Menu & Inventory Service running on port ${PORT}`);
    });
  } catch (error: unknown) {
    console.error('Service startup failed:', error);
    process.exit(1);
  }
}

startService();
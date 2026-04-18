import express from 'express';
import restaurantRoutes from './routes/restaurantRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[restaurant-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/restaurants', restaurantRoutes);

async function startRestaurantService(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log(`✓ Restaurant Service is running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Restaurant Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startRestaurantService();
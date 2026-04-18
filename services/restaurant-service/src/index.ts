import express from 'express';
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from './controllers/restaurantController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes mounted at root level (gateway strips /api/restaurants prefix)
app.post('/', createRestaurant);
app.get('/', getRestaurants);
app.put('/:id', updateRestaurant);
app.delete('/:id', deleteRestaurant);

// Alias for backward compatibility
app.post('/restaurants', createRestaurant);
app.get('/restaurants', getRestaurants);
app.put('/restaurants/:id', updateRestaurant);
app.delete('/restaurants/:id', deleteRestaurant);

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
import express from 'express';
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from './controllers/restaurantController';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/restaurants', createRestaurant);
app.get('/restaurants', getRestaurants);
app.put('/restaurants/:id', updateRestaurant);
app.delete('/restaurants/:id', deleteRestaurant);

app.listen(PORT, () => {
    console.log(`Restaurant Service is running on port ${PORT}`);
});
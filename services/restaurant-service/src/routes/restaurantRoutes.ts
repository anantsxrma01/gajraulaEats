import { Router } from 'express';
import { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant } from '../controllers/restaurantController';

const router = Router();

router.post('/', createRestaurant);
router.get('/', getRestaurants);
router.put('/:id', updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;

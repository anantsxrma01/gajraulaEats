import { Router } from 'express';
import {
  createUser,
  loginUser,
  verifyToken,
  sendOtp,
  verifyOtp
} from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', createUser);
router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/verify', authenticate, verifyToken);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;

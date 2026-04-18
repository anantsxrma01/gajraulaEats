import express from 'express';
import bodyParser from 'body-parser';
import { 
  createUser, 
  loginUser, 
  verifyToken, 
  sendOtp, 
  verifyOtp 
} from './controllers/authController';
import { authenticate } from './middlewares/authMiddleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'auth-service' });
});

// Authentication routes
app.post('/register', createUser);
app.post('/login', loginUser);
app.get('/verify', authenticate, verifyToken);

// OTP routes
app.post('/send-otp', sendOtp);
app.post('/verify-otp', verifyOtp);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

async function startAuthService(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log(`✓ Auth Service running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Auth Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startAuthService();
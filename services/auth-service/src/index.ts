import express from 'express';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[auth-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'auth-service' });
});

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
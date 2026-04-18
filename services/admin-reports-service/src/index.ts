import dotenv from 'dotenv';
import express from 'express';
import reportRoutes from './routes/report.routes';
import { connectDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[admin-reports-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/admin', reportRoutes);

async function startServer(): Promise<void> {
  console.log('Starting admin service...');

  try {
    await connectDatabase();
    console.log('Database connected successfully');
  } catch (error: any) {
    console.error('Database connection failed:', error instanceof Error ? error.message : String(error));
  }

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

startServer().catch((error: any) => {
  console.error('Startup failed:', error instanceof Error ? error.message : String(error));
});
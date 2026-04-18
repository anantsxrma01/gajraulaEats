import dotenv from 'dotenv';
import express from 'express';
import reportRoutes from './routes/report.routes';
import { connectDatabase } from './database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/reports', reportRoutes);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admin & Reports Service running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error('Database connection failed:', error instanceof Error ? error.message : String(error));
  });
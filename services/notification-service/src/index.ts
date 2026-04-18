import express from 'express';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[notification-service] received ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api/notify', notificationRoutes);

async function startNotificationService(): Promise<void> {
  try {
    app.listen(PORT, () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error: any) {
    console.error('Notification Service startup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

startNotificationService();
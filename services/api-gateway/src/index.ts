import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const serviceUrls = {
  auth: process.env.AUTH_SERVICE_URL || 'http://auth-service:4000',
  restaurants: process.env.RESTAURANT_SERVICE_URL || 'http://restaurant-service:4001',
  menu: process.env.MENU_SERVICE_URL || 'http://menu-inventory-service:4002',
  orders: process.env.ORDER_SERVICE_URL || 'http://order-service:4003',
  delivery: process.env.DELIVERY_SERVICE_URL || 'http://delivery-service:4004',
  payment: process.env.PAYMENT_SERVICE_URL || 'http://payment-wallet-service:4005',
  notify: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:4006',
  admin: process.env.ADMIN_SERVICE_URL || 'http://admin-reports-service:4007'
};

const proxyOptions = (target: string) => ({
  target,
  changeOrigin: true,
  pathRewrite: (path: string) => path.replace(/^\/api\/(auth|restaurants|menu|orders|delivery|payment|notify|admin)/, '')
});

Object.entries(serviceUrls).forEach(([key, url]) => {
  if (!url) {
    console.warn(`Missing URL for ${key} service; requests to /api/${key} will not be proxied.`);
    return;
  }

  app.use(`/api/${key}`, createProxyMiddleware(proxyOptions(url)));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function startGateway(): Promise<void> {
  console.log('Starting API Gateway...');

  try {
    app.listen(PORT, () => {
      console.log(`Gateway running on ${PORT}`);
    });
  } catch (error: any) {
    console.error('Gateway startup failed:', error instanceof Error ? error.message : String(error));
  }
}

startGateway();

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Define the API routes and their corresponding services
const apiRoutes = {
    '/auth': 'http://auth-service:4000',
    '/restaurants': 'http://restaurant-service:4001',
    '/menu': 'http://menu-inventory-service:4002',
    '/orders': 'http://order-service:4003',
    '/delivery': 'http://delivery-service:4004',
    '/payments': 'http://payment-wallet-service:4005',
    '/notifications': 'http://notification-service:4006',
    '/reports': 'http://admin-reports-service:4007',
};

// Set up proxy middleware for each route
Object.keys(apiRoutes).forEach(route => {
    app.use(route, createProxyMiddleware({ target: apiRoutes[route], changeOrigin: true }));
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway is running on http://localhost:${PORT}`);
});
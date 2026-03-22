import express from 'express';
import { PaymentController } from './controllers/payment.controller';
import { WalletController } from './controllers/wallet.controller';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Payment routes
app.post('/api/payments', PaymentController.processPayment);
app.get('/api/payments/:id', PaymentController.getPaymentStatus);

// Wallet routes
app.post('/api/wallets', WalletController.createWallet);
app.get('/api/wallets/:userId', WalletController.getWalletBalance);
app.post('/api/wallets/:userId/recharge', WalletController.rechargeWallet);

app.listen(PORT, () => {
    console.log(`Payment & Wallet Service running on port ${PORT}`);
});
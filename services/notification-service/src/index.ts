import express from 'express';
import { sendPushNotification, sendSMS, sendEmail } from './notificationHandlers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/push', async (req, res) => {
    const { userId, message } = req.body;
    try {
        await sendPushNotification(userId, message);
        res.status(200).send({ success: true, message: 'Push notification sent' });
    } catch (error: any) {
        res.status(500).send({ success: false, message: 'Failed to send push notification', error: error instanceof Error ? error.message : String(error) });
    }
});

app.post('/sms', async (req, res) => {
    const { phoneNumber, message } = req.body;
    try {
        await sendSMS(phoneNumber, message);
        res.status(200).send({ success: true, message: 'SMS sent' });
    } catch (error: any) {
        res.status(500).send({ success: false, message: 'Failed to send SMS', error: error instanceof Error ? error.message : String(error) });
    }
});

app.post('/email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        await sendEmail(email, subject, message);
        res.status(200).send({ success: true, message: 'Email sent' });
    } catch (error: any) {
        res.status(500).send({ success: false, message: 'Failed to send email', error: error instanceof Error ? error.message : String(error) });
    }
});

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
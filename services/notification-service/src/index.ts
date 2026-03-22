import express from 'express';
import { sendPushNotification, sendSMS, sendEmail } from './notificationHandlers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/notify/push', async (req, res) => {
    const { userId, message } = req.body;
    try {
        await sendPushNotification(userId, message);
        res.status(200).send({ success: true, message: 'Push notification sent' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to send push notification', error });
    }
});

app.post('/notify/sms', async (req, res) => {
    const { phoneNumber, message } = req.body;
    try {
        await sendSMS(phoneNumber, message);
        res.status(200).send({ success: true, message: 'SMS sent' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to send SMS', error });
    }
});

app.post('/notify/email', async (req, res) => {
    const { email, subject, message } = req.body;
    try {
        await sendEmail(email, subject, message);
        res.status(200).send({ success: true, message: 'Email sent' });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Failed to send email', error });
    }
});

app.listen(PORT, () => {
    console.log(`Notification Service running on port ${PORT}`);
});
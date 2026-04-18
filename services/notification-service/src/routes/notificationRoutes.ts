import { Router } from 'express';
import { sendPushNotification, sendSMS, sendEmail } from '../notificationHandlers';

const router = Router();

router.post('/push', async (req, res) => {
  const { userId, message } = req.body;

  try {
    await sendPushNotification(userId, message);
    res.status(200).json({ success: true, message: 'Push notification sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to send push notification', error: error instanceof Error ? error.message : String(error) });
  }
});

router.post('/sms', async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    await sendSMS(phoneNumber, message);
    res.status(200).json({ success: true, message: 'SMS sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to send SMS', error: error instanceof Error ? error.message : String(error) });
  }
});

router.post('/email', async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to send email', error: error instanceof Error ? error.message : String(error) });
  }
});

export default router;

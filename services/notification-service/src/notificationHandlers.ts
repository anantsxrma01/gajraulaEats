import * as admin from 'firebase-admin';
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export async function sendPushNotification(userId: string, message: string): Promise<void> {
  // Initialize Firebase Admin SDK if not already done
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL
      })
    });
  }

  const payload = {
    notification: {
      title: 'Notification',
      body: message
    }
  };

  await admin.messaging().sendToTopic(userId, payload);
}

export async function sendSMS(to: string, message: string): Promise<void> {
  await twilioClient.messages.create({
    body: message,
    from: process.env.SMS_FROM_NUMBER,
    to: to
  });
}

export async function sendEmail(to: string, subject: string, message: string): Promise<void> {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: message
  };

  await emailTransporter.sendMail(mailOptions);
}
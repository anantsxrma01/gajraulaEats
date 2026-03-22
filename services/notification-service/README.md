# Notification Service

The Notification Service is responsible for managing notifications across the local food delivery platform. It handles the delivery of notifications via various channels, including push notifications, SMS, and email.

## Features

- **Push Notifications**: Send real-time notifications to users, delivery partners, and shop owners.
- **SMS Notifications**: Send important updates and alerts via SMS.
- **Email Notifications**: Provide users with order confirmations, receipts, and promotional content.

## Setup

1. **Install Dependencies**: Run `npm install` to install the required packages.
2. **Configuration**: Update the configuration files to set up API keys and other necessary settings for the notification channels.
3. **Start the Service**: Use `npm start` to run the notification service.

## API Endpoints

- **POST /notifications/push**: Send a push notification.
- **POST /notifications/sms**: Send an SMS notification.
- **POST /notifications/email**: Send an email notification.

## Usage

Integrate the Notification Service with other services in the platform to ensure timely communication with users, delivery partners, and shop owners.

## License

This project is licensed under the MIT License.
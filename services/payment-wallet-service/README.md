# Payment & Wallet Service

The Payment & Wallet Service is responsible for handling payment processing and wallet management within the local food delivery platform. This service integrates with various payment gateways to facilitate secure transactions and manage user wallet balances.

## Features

- **Payment Processing**: Supports multiple payment methods including UPI, credit/debit cards, and net banking.
- **Wallet Management**: Allows users to maintain a wallet balance for quick transactions.
- **Transaction History**: Keeps track of all transactions made through the service.
- **Refund Management**: Handles refund requests and processes them accordingly.
- **Integration with Notification Service**: Sends notifications for payment confirmations, wallet updates, and transaction alerts.

## API Endpoints

- **POST /payments**: Initiates a payment transaction.
- **GET /payments/:id**: Retrieves the status of a specific payment transaction.
- **POST /wallet/topup**: Adds funds to the user's wallet.
- **GET /wallet/:userId**: Retrieves the wallet balance and transaction history for a user.

## Setup

1. Clone the repository.
2. Navigate to the `payment-wallet-service` directory.
3. Install dependencies using your preferred package manager (e.g., npm, yarn).
4. Configure environment variables as needed.
5. Start the service using the command: `npm start`.

## Dependencies

- Express.js for handling HTTP requests.
- Mongoose for MongoDB interactions (if using MongoDB).
- A payment gateway SDK (e.g., Razorpay, PayU) for processing payments.

## Testing

To run tests for the Payment & Wallet Service, use the command: `npm test`.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
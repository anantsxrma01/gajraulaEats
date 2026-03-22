# Auth Service

The Auth Service is responsible for handling user authentication and authorization within the local food delivery platform. It provides functionalities such as user registration, login, password management, and token generation for secure access to other services.

## Features

- User Registration: Allows new users to create an account.
- User Login: Authenticates users and provides access tokens.
- Password Management: Supports password reset and update functionalities.
- Token Generation: Issues JWT tokens for secure communication between services.
- Role-Based Access Control: Manages user roles and permissions.

## Installation

To install the Auth Service, navigate to the `auth-service` directory and run:

```bash
npm install
```

## Usage

To start the Auth Service, use the following command:

```bash
npm start
```

Ensure that the necessary environment variables are set in your `.env` file.

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and return a token.
- `POST /api/auth/forgot-password`: Initiate password reset process.
- `POST /api/auth/reset-password`: Reset user password.

## Dependencies

This service relies on the following packages:

- Express: For building the API.
- JWT: For token generation and verification.
- Bcrypt: For password hashing.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
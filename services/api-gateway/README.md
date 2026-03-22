# API Gateway Service

The API Gateway serves as the entry point for all client requests to the local food delivery platform. It handles routing, authentication, and communication with various backend services.

## Features

- **Routing**: Directs incoming API requests to the appropriate service.
- **Authentication**: Validates user credentials and manages sessions.
- **Rate Limiting**: Controls the number of requests a user can make to prevent abuse.
- **Logging**: Records API usage for monitoring and debugging.
- **Error Handling**: Provides consistent error responses to clients.

## Getting Started

1. **Installation**: 
   - Clone the repository.
   - Navigate to the `api-gateway` directory.
   - Run `npm install` to install dependencies.

2. **Configuration**:
   - Create a `.env` file based on the `.env.example` provided.
   - Set up necessary environment variables for service URLs and authentication.

3. **Running the Service**:
   - Use `npm start` to run the API Gateway locally.
   - The service will be available at `http://localhost:PORT`, where `PORT` is defined in your configuration.

## API Documentation

Refer to the [API Documentation](docs/api.md) for detailed information on available endpoints, request/response formats, and authentication methods.

## Contributing

Contributions are welcome! Please follow the standard Git workflow for submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
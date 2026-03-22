# Local Food Delivery Platform

This project is a comprehensive local food delivery system designed to facilitate the ordering and delivery of food within a 30 km radius. The platform consists of multiple applications and services that work together to provide a seamless experience for users, restaurant owners, delivery partners, and management teams.

## Project Structure

The project is organized into several key components:

- **Apps**: Contains the frontend applications for different user roles.
  - **Owner Dashboard**: A web application for business owners to manage the platform.
  - **Management Portal**: A web application for operations staff to monitor and manage orders.
  - **Shop App**: An application for restaurants and cloud kitchens to manage their orders and menus.
  - **Delivery App**: An application for delivery partners to receive and manage delivery assignments.
  - **User App**: A mobile application for customers to browse restaurants, place orders, and track deliveries.

- **Services**: Contains the backend services that handle various functionalities of the platform.
  - **API Gateway**: Manages API requests and routing.
  - **Auth Service**: Handles user authentication and authorization.
  - **Restaurant Service**: Manages restaurant-related operations.
  - **Menu & Inventory Service**: Manages menu items and inventory.
  - **Order Service**: Manages order processing and status.
  - **Delivery Service**: Manages delivery assignments and tracking.
  - **Payment & Wallet Service**: Handles payment processing and wallet management.
  - **Notification Service**: Manages notifications via push, SMS, and email.
  - **Admin & Reports Service**: Generates reports and handles admin tasks.

- **Libraries**: Contains shared libraries for common utilities, contracts, and UI components.

- **Infrastructure**: Contains configuration files for Docker, Kubernetes, and Terraform for deployment and infrastructure management.

- **Database**: Contains documentation for database migrations and seeding.

- **Documentation**: Contains architectural documentation and other relevant project information.

## Getting Started

To get started with the project, follow these steps:

1. **Clone the Repository**: Clone the repository to your local machine.
2. **Install Dependencies**: Navigate to each application and service directory and run `npm install` or `pnpm install` to install the required dependencies.
3. **Set Up Environment Variables**: Create a `.env` file based on the `.env.example` file and configure your environment variables.
4. **Run the Applications**: Use Docker Compose to start the services and applications. Run `docker-compose up` from the root directory.
5. **Access the Applications**: Open your browser and navigate to the respective URLs for the Owner Dashboard, Management Portal, Shop App, Delivery App, and User App.

## Contributing

Contributions are welcome! If you would like to contribute to the project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
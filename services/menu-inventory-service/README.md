# Menu & Inventory Service

The Menu & Inventory Service is responsible for managing menu items and inventory for the local food delivery platform. This service handles the creation, updating, and deletion of menu items, as well as tracking inventory levels for each item.

## Features

- **Menu Management**: Create, update, and delete menu items and categories.
- **Inventory Tracking**: Monitor stock levels for each menu item and manage availability.
- **Integration**: Works seamlessly with the Order Service to ensure accurate menu availability during order processing.

## API Endpoints

- **GET /menus**: Retrieve a list of all menus.
- **POST /menus**: Create a new menu item.
- **PUT /menus/:id**: Update an existing menu item.
- **DELETE /menus/:id**: Delete a menu item.
- **GET /inventory**: Retrieve current inventory levels.
- **PUT /inventory/:id**: Update inventory levels for a specific item.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express**: Web framework for building the API.
- **MongoDB/PostgreSQL**: Database for storing menu and inventory data.
- **Redis**: Caching layer for improved performance.

## Setup

1. Clone the repository.
2. Navigate to the `menu-inventory-service` directory.
3. Install dependencies using `npm install`.
4. Configure environment variables in a `.env` file.
5. Start the service using `npm start`.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for discussion.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
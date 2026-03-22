# Local Food Delivery Platform Architecture

## Overview
The Local Food Delivery Platform is designed to facilitate food delivery services within a 30 km radius. The system consists of multiple applications and services that work together to provide a seamless experience for users, shop owners, delivery partners, and management.

## High-Level Architecture

### Frontend Applications
1. **Owner App**: A web/mobile application for business owners to manage the platform, view analytics, and control finances.
2. **Management Portal**: A web application for the operations team to monitor live orders, manage disputes, and oversee daily operations.
3. **Shop App**: An application for restaurants and cloud kitchens to manage their menu, orders, and earnings.
4. **Delivery Partner App**: An Android application for delivery partners to receive orders, navigate to locations, and track earnings.
5. **User App**: A mobile application for customers to browse restaurants, place orders, and track deliveries.

### Backend Services
- **API Gateway**: Acts as a single entry point for all client requests, routing them to the appropriate services.
- **Auth Service**: Handles user authentication and authorization.
- **Restaurant/Shop Service**: Manages restaurant-related operations and data.
- **Menu & Inventory Service**: Manages menu items and inventory levels.
- **Order Service**: Processes orders and manages their status.
- **Delivery/Logistics Service**: Handles delivery assignments and tracking.
- **Payment & Wallet Service**: Manages payment processing and wallet functionalities.
- **Notification Service**: Sends notifications via push, SMS, and email.
- **Admin & Reports Service**: Generates reports and handles administrative tasks.

### Databases
- **Main Database**: PostgreSQL or MongoDB for storing application data.
- **Geo/Radius Logic**: Utilizes PostGIS for geographical queries or stores latitude and longitude for distance calculations.
- **Cache**: Redis for caching live orders and assignments.
- **Storage**: S3 or Firebase Storage for images and documents.

### Integrations
- **Payments**: Integrates with payment gateways like Razorpay or PayU for processing transactions.
- **Maps & Location**: Uses Google Maps API or Mapbox for location services.
- **SMS/OTP**: Integrates with services like Twilio for sending SMS and OTPs.
- **Push Notifications**: Utilizes Firebase Cloud Messaging (FCM) for sending push notifications.

## 30 km Radius Logic
The service area is defined as a 30 km radius from a central point. The system enforces this by:
- Storing the center point coordinates.
- Checking user, shop, and order locations against this radius during sign-up, shop display, and delivery assignments.

## Conclusion
This architecture provides a robust framework for building a local food delivery platform, ensuring scalability, maintainability, and a great user experience. Each component is designed to work in harmony, providing a seamless flow from order placement to delivery.
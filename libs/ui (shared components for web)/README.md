# UI Library for Local Food Delivery Platform

This library contains shared UI components used across various applications in the Local Food Delivery Platform. The components are designed to be reusable and customizable to ensure a consistent user experience across different apps.

## Installation

To install the UI library, use the following command:

```
npm install @local-food-delivery-platform/ui
```

## Usage

Import the components you need in your application:

```javascript
import { Button, Card, Modal } from '@local-food-delivery-platform/ui';
```

## Components

### Button

A customizable button component.

**Props:**
- `label`: The text to display on the button.
- `onClick`: Function to call when the button is clicked.
- `disabled`: Boolean to disable the button.

### Card

A card component for displaying content.

**Props:**
- `title`: The title of the card.
- `content`: The main content of the card.
- `footer`: Optional footer content.

### Modal

A modal dialog component.

**Props:**
- `isOpen`: Boolean to control the visibility of the modal.
- `onClose`: Function to call when the modal is closed.
- `children`: Content to display inside the modal.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
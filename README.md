# Zomato Clone - React, Flask, MongoDB

This project is a clone of the popular food delivery app Zomato. It is built using React for the frontend, Flask for the backend, and MongoDB for the database.

## Project Structure

- **Frontend**: Built with React, it includes components for displaying the home page, menu list, food items, cart, and user authentication pages.
- **Backend**: Built with Flask, it includes models for users, menu items, and orders, and provides API endpoints for interacting with the database.
- **Database**: MongoDB is used to store user data, menu items, and orders.

## Features

### Home Page
Displays a welcome message and an introduction to the app. Users can navigate to view the menu.

### Menu Items
Displays a list of food items available for order. Users can filter items by category.

### Admin Page
Allows the admin to manage menu items, including adding, updating, and deleting items.

### My Orders Page
Displays a list of orders placed by the logged-in user.

### Login/Logout
Allows users to sign up, log in, and log out. Authentication is handled using JWT tokens.

### Filtering Food Items
Users can filter food items by category using the menu list.

### Cart Page
Displays the items added to the cart. Users can increase or decrease the quantity of items or remove them from the cart.

### Payment Page
Allows users to proceed with the payment for the items in the cart.

## Development Process

### 1. Setting Up the Frontend

1. **Create React App**: Initialize the project using Create React App.
2. **Components**: Create reusable components such as `Navbar`, `Home`, `MenuList`, `FoodItems`, `Cart`, `SignUp`, `SignIn`, `Payment`, `Admin`, and `MyOrders`.
3. **Styling**: Use CSS for styling the components.
4. **Routing**: Use React Router for navigation between different pages.

### 2. Setting Up the Backend

1. **Flask Setup**: Initialize a Flask application.
2. **Models**: Create models for `User`, `MenuItem`, and `Order`.
3. **Database Connection**: Connect to MongoDB using `pymongo`.
4. **API Endpoints**: Create API endpoints for user authentication, fetching menu items, and managing orders.

### 3. Integrating Frontend and Backend

1. **API Calls**: Use `fetch` to make API calls from the React frontend to the Flask backend.
2. **State Management**: Use React's `useState` and `useEffect` hooks to manage state and side effects.
3. **Error Handling**: Implement error handling for API calls.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run eject`

Ejects the Create React App configuration.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

To learn Flask, check out the [Flask documentation](https://flask.palletsprojects.com/).

To learn MongoDB, check out the [MongoDB documentation](https://docs.mongodb.com/).

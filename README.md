Overview
This project is an E-Commerce Web Application that allows customers to browse and purchase products. It includes features such as user authentication, product listing, and checkout functionality.

Technologies Used
Frontend:

React.js
Redux for state management
CSS for styling
Backend:

Node.js with Express.js
MongoDB for database
Project Structure
Client:

src/components: React components for different pages (e.g., Home, Shop, Checkout).
src/redux: Redux store setup and actions.
src/styles: CSS files for styling.
Server:

server.js: Entry point for the Express.js server.
routes: API routes for handling customer-related actions (e.g., product listing, checkout).
Database:

MongoDB: Collections include customers, products, orders.
Features
User Authentication:

Customers can sign up, log in, and log out.
Authentication tokens are used for secure API requests.
Product Listing:

Display all products available for purchase.
Each product includes an image, description, and "Add to Cart" button.
Shopping Cart:

Customers can add products to their cart.
Cart details are stored in the customer collection.
Checkout:

Secure checkout process with form validation.
Orders are created for each product in the cart.
Order History:

Customers can view their order history.
Orders are categorized as pending or completed.
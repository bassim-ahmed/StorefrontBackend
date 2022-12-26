# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index : '/products' [GET]
- Show : '/products/:id' [GET]
- Create [token required] : '/products' [POST]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category) : '/products' [GET]

#### Users
- Index [token required] : '/users' [GET]
- Show [token required] : '/users/:id' [GET]
- Create N[token required] : '/users' [POST] 

#### Orders
- Current Order by user (args: user id)[token required] : '/orders/open/user/:id' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] : '/orders/completed/user/:id' [GET]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

TABLE products (id: SERIAL [PRIMARY KEY], name: VARCHAR, price: INTEGER [Price in cents], category: VARCHAR)

#### User
- id
- firstName
- lastName
- password

TABLE users (id: SERIAL [PRIMARY KEY], username: VARCHAR, first_name: VARCHAR, last_name: VARCHAR, password_hash: VARCHAR)

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

TABLE orders (id: SERIAL [PRIMARY KEY], user_id: INTEGER [foreign key to users table], status: VARCHAR)

TABLE order_products(id: SERIAL [PRIMARY KEY], order_id: INTEGER [foreign key to orders table], product_id: INTEGER [foreign key to products table], quantity: INTEGER)

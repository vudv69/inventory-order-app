# inventory-order-app

Inventory & Order Management application where staff manage stock and process orders.

## Backend

To start the backend app, please refer to the backend/README.md file.

Since this week is a sprint release, I only spent 3 hours to complete the following:

- Initialized the repository using the NestJS framework
- Started PostgreSQL using Docker
- Set up simple authentication with JWT (using only username, no password)
- Set up simple authorization by role (using the users.role field)
- Set up API versioning (/v1)
- Set up database migration
- Integrated Swagger
- Wrote test cases for product api
- Implemented a login API: `POST localhost:3001/v1/login`
  - Seed 2 users: `manager` and `user`

- Implemented product APIs:

- Get a list of products with pagination (permission: logged-in user)
  - `GET localhost:3001/v1/products`

- Create, update, and delete a product (permission: Manager)
  - `POST localhost:3001/v1/products`
  - `PUT localhost:3001/v1/products/:id`
  - `DELETE localhost:3001/v1/products/:id`


#### Some tasks are not implemented yet:
- API for order


## Frontend

- Init repo with Refine framework
- Design login page
- Design the products page (integrated APIs)


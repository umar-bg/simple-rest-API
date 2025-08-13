## Documentation
Features Demonstrated:
Non-blocking I/O: All routes use async/await pattern

Concurrency Handling: /api/stress-test simulates variable processing times

Error Handling: Try/catch blocks and error middleware

RESTful Design: Proper HTTP methods and status codes

Scalability: Lightweight implementation suitable for horizontal scaling

Endpoints:
GET /api/products - List all products

GET /api/products/:id - Get single product

POST /api/products - Create new product

GET /api/stress-test - For load testing concurrent connections
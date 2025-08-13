// server.js - Main application entry point
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database with sample data
let products = [
  { id: 1, name: 'Laptop', price: 999.99, inStock: true },
  { id: 2, name: 'Smartphone', price: 699.99, inStock: true },
  { id: 3, name: 'Headphones', price: 149.99, inStock: false }
];

// Utility functions
const findProductById = (id) => products.find(p => p.id === parseInt(id));
const validateProduct = (product) => {
  if (!product.name || typeof product.name !== 'string') {
    return { valid: false, error: 'Product name is required and must be a string' };
  }
  if (!product.price || isNaN(product.price)) {
    return { valid: false, error: 'Product price is required and must be a number' };
  }
  return { valid: true };
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Product API Service');
});

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST new product
app.post('/api/products', (req, res) => {
  const validation = validateProduct(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    price: parseFloat(req.body.price),
    inStock: req.body.inStock || false
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT update product
app.put('/api/products/:id', (req, res) => {
  const product = findProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const validation = validateProduct(req.body);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  Object.assign(product, {
    name: req.body.name,
    price: parseFloat(req.body.price),
    inStock: req.body.inStock !== undefined ? req.body.inStock : product.inStock
  });

  res.json(product);
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deletedProduct = products.splice(productIndex, 1)[0];
  res.json({ message: 'Product deleted', product: deletedProduct });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory "database" for demonstration
let products = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 },
  { id: 3, name: 'Headphones', price: 149.99 }
];

// Simulate async database operation
const simulateAsyncOperation = (operation, delay = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(operation()), delay);
  });
};

// Routes
app.get('/api/products', async (req, res) => {
  try {
    const result = await simulateAsyncOperation(() => products);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await simulateAsyncOperation(() => 
      products.find(p => p.id === parseInt(req.params.id))
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = {
      id: products.length + 1,
      name: req.body.name,
      price: parseFloat(req.body.price)
    };

    await simulateAsyncOperation(() => {
      products.push(newProduct);
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Concurrent connection test endpoint
app.get('/api/stress-test', async (req, res) => {
  const delay = Math.floor(Math.random() * 1000);
  await simulateAsyncOperation(() => {}, delay);
  res.json({
    message: `Request ${req.query.id || ''} processed after ${delay}ms`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
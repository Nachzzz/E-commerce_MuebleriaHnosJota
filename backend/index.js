const express = require('express');
const path = require('path');
const productosRouter = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 4000;

// Simple logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// API routes
app.use('/api/productos', productosRouter);

// Serve client public if needed (optional)
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

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

// Simple CORS middleware for development
app.use((req, res, next) => {
  // Allow any origin for development; restrict in production
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

// Llamada a la ruta de productos
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

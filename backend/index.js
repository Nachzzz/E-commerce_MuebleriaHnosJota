const express = require('express');
require('dotenv').config();
const path = require('path');
const productosRouter = require('./routes/productos');
const userRoutes = require('./routes/userRoutes');

const app = express();
const { connectDB } = require('./data/db.js');

const PORT = process.env.PORT || 4000;

// Conexión a MongoDB
connectDB().then(() => {
  console.log('Base de datos conectada correctamente ✅');

  // Inicio del servidor
  app.listen(PORT, () => {
    console.log(`Backend alojado en http://localhost:${PORT}`);
  });
})
.catch((error) => {
  console.error('Error al conectar a la base de datos:', error.message)
  process.exit(1)
})

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

// Llamada a la ruta de productos (ya usa /api)
app.use('/api/productos', productosRouter);

// ⚠️ CAMBIO CRUCIAL: Llamada a la ruta de usuarios con prefijo API
// Ahora, la ruta completa para el registro es /api/usuarios/registro
app.use('/api/usuarios', userRoutes); 

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

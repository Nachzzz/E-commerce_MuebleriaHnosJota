const express = require('express');
require('dotenv').config();
const path = require('path');
const productosRouter = require('./routes/productos');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

app.use('/api/productos', productosRouter);

app.use('/api/usuarios', userRoutes); 

app.use('/api/orders', orderRoutes);

app.use(express.static(path.join(__dirname, '..', 'client', 'public')));

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});
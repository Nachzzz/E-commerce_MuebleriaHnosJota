const express = require('express');
const router = express.Router();
const productos = require('../data/productos');

// GET /api/productos
router.get('/', (req, res) => {
  res.json(productos);
});

// GET /api/productos/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = productos.find((x) => Number(x.id) === id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

module.exports = router;

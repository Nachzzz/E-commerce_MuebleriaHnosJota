const express = require('express');
const router = express.Router();
const productos = require('../data/productos');
const fs = require('fs').promises;
const path = require('path');

// Endpoint GET /api/productos - devuelve todos los productos
router.get('/', (req, res) => {
  const destacados = productos;
  res.json(destacados);
});

// Endpoint GET /api/productos/destacados - devuelve los 4 productos destacados
router.get('/destacados', (req, res) => {
  const destacados = productos.slice(0, 4);
  res.json(destacados);
});

// Endpoint GET /api/productos/:id - devuelve un producto por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = productos.find((x) => Number(x.id) === id);
  if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(p);
});

// Endpoint POST /api/productos - crea un nuevo producto
router.post('/', (req, res) => {
  const { nombre, descripcion, precio, stock, imagen, valoracion, tipo, material, acabado, medidas, tiempo } = req.body;

  // Validar que se recibieron todos los campos necesarios
  if (!nombre || !descripcion || !precio || !stock || !imagen || !valoracion || !tipo || !material || !acabado || !medidas || !tiempo) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  // Crear un nuevo producto
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    descripcion,
    precio,
    stock,
    imagen,
    valoracion,
    tipo,
    material,
    acabado,
    medidas,
    tiempo
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

// Persistir nuevo producto en backend/data/productos.json (safe async version)
router.post('/persist', async (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'productos.json');
  const nuevoProducto = req.body;

  // Basic validation
  if (!nuevoProducto || !nuevoProducto.nombre) {
    return res.status(400).json({ error: 'Producto inválido' });
  }

  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const list = JSON.parse(raw || '[]');
    nuevoProducto.id = list.length > 0 ? list[list.length - 1].id + 1 : 1;
    list.push(nuevoProducto);
    await fs.writeFile(filePath, JSON.stringify(list, null, 2), 'utf8');
    return res.status(201).json({ mensaje: 'Producto guardado', producto: nuevoProducto });
  } catch (err) {
    console.error('Error escribiendo productos.json', err);
    return res.status(500).json({ error: 'No se pudo guardar el producto' });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/auth');

// Ruta para crear orden (POST /api/orders)
// Protegida: Solo usuarios con token pueden comprar
router.post('/', verifyToken, orderController.createOrder);

// Ruta para ver historial (GET /api/orders/mis-pedidos)
// Protegida: Solo el dueño de la cuenta puede ver sus pedidos
router.get('/mis-pedidos', verifyToken, orderController.getMyOrders);

module.exports = router;
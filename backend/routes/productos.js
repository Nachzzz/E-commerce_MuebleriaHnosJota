const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth'); // <--- Importar
const { 
    handleValidationErrors, 
    validatePostProduct, 
    validatePutProduct 
} = require('../middlewares/productValidator');

// Rutas Públicas
router.get('/', productoController.getProductos);
router.get('/:id', productoController.getProductoById);

// Rutas Privadas (Solo Admin)
router.post('/',
    verifyToken, // 1. Verifica login
    verifyAdmin, // 2. Verifica rol
    validatePostProduct,
    handleValidationErrors,
    productoController.createProducto
);

router.put('/:id',
    verifyToken,
    verifyAdmin,
    validatePutProduct,
    handleValidationErrors,
    productoController.updateProducto
);

router.delete('/:id', 
    verifyToken,
    verifyAdmin,
    productoController.deleteProducto
);

module.exports = router;
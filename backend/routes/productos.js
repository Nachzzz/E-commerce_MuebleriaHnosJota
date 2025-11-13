const express = require('express');
const router = express.Router();

// Importar el controlador
const productoController = require('../controllers/productoController');

// Importar middlewares de validación
const { 
    handleValidationErrors, 
    validatePostProduct, 
    validatePutProduct 
} = require('../middlewares/productValidator');

// --- DEFINICIÓN DE ENDPOINTS CRUD ---

router.get('/', productoController.getProductos);

router.get('/:id', productoController.getProductoById);

router.post('/',
    validatePostProduct,
    handleValidationErrors,
    productoController.createProducto
);

router.put('/:id',
    validatePutProduct,
    handleValidationErrors,
    productoController.updateProducto
);

router.delete('/:id', productoController.deleteProducto);


module.exports = router;
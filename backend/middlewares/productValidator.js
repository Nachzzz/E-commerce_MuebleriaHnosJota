// backend/middlewares/productValidator.js
const { body, validationResult } = require('express-validator');

/**
 * @desc    Middleware de Ayuda: Revisa si validationResult tuvo errores y responde si los hay.
 */
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            msg: "Error de validación de datos", 
            errors: errors.array() 
        });
    }
    // Si no hay errores, pasa al siguiente middleware (el controlador)
    next();
};

/**
 * @desc    Reglas de Validación para POST (Crear Producto)
 */
exports.validatePostProduct = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    
    body('precio')
        .notEmpty().withMessage('El precio es obligatorio.')
        .isNumeric().withMessage('El precio debe ser un valor numérico.')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0.'),
    
    body('stock')
        .optional() // El stock es opcional al crear
        .isNumeric().withMessage('El stock debe ser un número.')
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo.')
];

/**
 * @desc    Reglas de Validación para PUT (Actualizar Producto)
 */
exports.validatePutProduct = [
    body('nombre')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    
    body('precio')
        .optional()
        .isNumeric().withMessage('El precio debe ser un valor numérico.')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0.'),
    
    body('stock')
        .optional()
        .isNumeric().withMessage('El stock debe ser un número.')
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo.')
];
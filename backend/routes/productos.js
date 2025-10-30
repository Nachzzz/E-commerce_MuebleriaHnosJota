const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Importamos el modelo de Producto
// (Asegúrate de que la ruta a tu modelo sea correcta desde la carpeta 'routes')
const Producto = require('../models/producto_model');

/**
 * Middleware de Ayuda:
 * Revisa si validationResult tuvo errores y responde si los hay.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            msg: "Error de validación de datos", 
            errors: errors.array() 
        });
    }
    // Si no hay errores, pasa al siguiente middleware (el controlador async)
    next();
};

/**
 * Reglas de Validación para POST (Crear Producto)
 * Aquí los campos son obligatorios.
 */
const validatePostProduct = [
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
 * Reglas de Validación para PUT (Actualizar Producto)
 * Aquí todos los campos son opcionales.
 */
const validatePutProduct = [
    body('nombre')
        .optional() // <-- Esta es la corrección clave para PUT
        .trim()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    
    body('precio')
        .optional() // <-- Corrección clave
        .isNumeric().withMessage('El precio debe ser un valor numérico.')
        .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor que 0.'),
    
    body('stock')
        .optional() // <-- Corrección clave
        .isNumeric().withMessage('El stock debe ser un número.')
        .isInt({ min: 0 }).withMessage('El stock no puede ser negativo.')
];


// --- DEFINICIÓN DE ENDPOINTS CRUD ---

/**
 * @route   GET /api/productos
 * @desc    Devuelve todos los productos de la colección.
 */
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor al obtener productos.' });
    }
});

/**
 * @route   GET /api/productos/:id
 * @desc    Devuelve un único producto por su _id.
 */
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }
        res.json(producto);
    } catch (err) {
        console.error(err.message);
        // Manejo de error si el ID tiene un formato inválido
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producto no encontrado (ID mal formado).' });
        }
        res.status(500).json({ msg: 'Error del servidor.' });
    }
});

/**
 * @route   POST /api/productos
 * @desc    Crea un nuevo documento en la base de datos.
 */
router.post('/',
    validatePostProduct,      // 1. Aplica reglas de POST
    handleValidationErrors,   // 2. Maneja errores de validación
    async (req, res) => {
        try {
            // req.body ya fue validado
            const nuevoProducto = new Producto(req.body);
            
            await nuevoProducto.save();
            
            res.status(201).json(nuevoProducto); // 201 Created

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Error del servidor al crear el producto.' });
        }
    }
);

/**
 * @route   PUT /api/productos/:id
 * @desc    Recibe datos y modifica el producto en la base de datos.
 */
router.put('/:id',
    validatePutProduct,       // 1. Aplica reglas de PUT (opcionales)
    handleValidationErrors,   // 2. Maneja errores de validación
    async (req, res) => {
        try {
            // $set: req.body actualiza solo los campos que vienen en el body
            // new: true devuelve el documento modificado
            const producto = await Producto.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true, runValidators: true } 
            );

            if (!producto) {
                return res.status(404).json({ msg: 'Producto no encontrado.' });
            }

            res.status(200).json(producto); // 200 OK

        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Producto no encontrado (ID mal formado).' });
            }
            res.status(500).json({ msg: 'Error del servidor al actualizar.' });
        }
    }
);

/**
 * @route   DELETE /api/productos/:id
 * @desc    Elimina un producto de la base de datos por su _id.
 */
router.delete('/:id', async (req, res) => {
    try {
        const producto = await Producto.findByIdAndDelete(req.params.id);

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        res.status(200).json({ msg: 'Producto eliminado correctamente.' });

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producto no encontrado (ID mal formado).' });
        }
        res.status(500).json({ msg: 'Error del servidor al eliminar.' });
    }
});


// Exportamos el router para que index.js pueda usarlo
module.exports = router;
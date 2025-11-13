// backend/controllers/productoController.js
const Producto = require('../models/producto_model');

/**
 * @desc    Devuelve todos los productos de la colección.
 * @route   GET /api/productos
 */
exports.getProductos = async (req, res) => {
    try {
        const productos = await Producto.find({});
        res.json(productos);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor al obtener productos.' });
    }
};

/**
 * @desc    Devuelve un único producto por su _id.
 * @route   GET /api/productos/:id
 */
exports.getProductoById = async (req, res) => {
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
};

/**
 * @desc    Crea un nuevo documento en la base de datos.
 * @route   POST /api/productos
 */
exports.createProducto = async (req, res) => {
    try {
        // req.body ya fue validado por el middleware
        const nuevoProducto = new Producto(req.body);
        
        await nuevoProducto.save();
        
        res.status(201).json(nuevoProducto);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Error del servidor al crear el producto.' });
    }
};

/**
 * @desc    Recibe datos y modifica el producto en la base de datos.
 * @route   PUT /api/productos/:id
 */
exports.updateProducto = async (req, res) => {
    try {
        // $set: req.body actualiza solo los campos que vienen en el body
        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true } // new: true devuelve el documento modificado
        );

        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        res.status(200).json(producto);

    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Producto no encontrado (ID mal formado).' });
        }
        res.status(500).json({ msg: 'Error del servidor al actualizar.' });
    }
};

/**
 * @desc    Elimina un producto de la base de datos por su _id.
 * @route   DELETE /api/productos/:id
 */
exports.deleteProducto = async (req, res) => {
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
};
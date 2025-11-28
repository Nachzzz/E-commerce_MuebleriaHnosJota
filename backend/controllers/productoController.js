const Producto = require('../models/producto_model');
const Review = require('../models/review_model');

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

/**
 * @desc    Crear una nueva reseña
 * @route   POST /api/productos/:id/reviews
 */
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    try {
        const product = await Producto.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // Verificar si ya comentó
        const alreadyReviewed = await Review.findOne({
            user: req.user.id,
            product: productId
        });

        if (alreadyReviewed) {
            return res.status(400).json({ msg: 'Ya has valorado este producto' });
        }

        // Crear reseña
        const review = new Review({
            user: req.user.id,
            username: req.user.username, // Asumimos que viene en el token o lo buscamos
            product: productId,
            rating: Number(rating),
            comment
        });

        await review.save();

        // RE-CALCULAR PROMEDIO
        // Buscamos todas las reviews de este producto
        const reviews = await Review.find({ product: productId });
        
        // Calcular promedio
        const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        // Actualizar producto
        product.valoracion = avg;
        // Opcional: product.numReviews = reviews.length;
        await product.save();

        res.status(201).json({ msg: 'Reseña agregada' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al guardar la reseña' });
    }
};

/**
 * @desc    Obtener reseñas de un producto
 * @route   GET /api/productos/:id/reviews
 */
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener reseñas' });
    }
};
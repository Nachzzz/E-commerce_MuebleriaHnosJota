const Order = require('../models/order_model');
const Producto = require('../models/producto_model');

exports.createOrder = async (req, res) => {
    try {
        const { items, shippingDetails, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No hay ítems en la orden' });
        }

        // VERIFICACIÓN DE STOCK (Paso crítico antes de procesar)
        for (const item of items) {
            const productDB = await Producto.findById(item.producto);
            if (!productDB) {
                return res.status(404).json({ message: `Producto no encontrado: ${item.nombre}` });
            }
            if (productDB.stock < item.cantidad) {
                return res.status(400).json({ 
                    message: `Stock insuficiente para ${productDB.nombre}. Disponible: ${productDB.stock}` 
                });
            }
        }

        // DESCONTAR STOCK (Solo si la validación anterior pasó)
        for (const item of items) {
            await Producto.findByIdAndUpdate(item.producto, {
                $inc: { stock: -item.cantidad } // $inc con negativo resta
            });
        }

        // Crea la orden
        const newOrder = new Order({
            user: req.user.id, 
            items,
            shippingDetails,
            totalAmount,
            status: 'paid'
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);

    } catch (error) {
        console.error("Error creando orden:", error);
        res.status(500).json({ message: 'Error del servidor al procesar la orden' });
    }
};

/**
 * @desc    Obtener las órdenes del usuario logueado
 * @route   GET /api/orders/mis-pedidos
 * @access  Private
 */
exports.getMyOrders = async (req, res) => {
    try {
        // Buscamos órdenes donde el campo 'user' coincida con el ID del token
        // .sort({ createdAt: -1 }) hace que salgan las más nuevas primero
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        
        res.status(200).json(orders);

    } catch (error) {
        console.error("Error obteniendo órdenes:", error);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
};
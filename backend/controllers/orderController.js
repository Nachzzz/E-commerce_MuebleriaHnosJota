const Order = require('../models/order_model');

/**
 * @desc    Crear una nueva orden
 * @route   POST /api/orders
 * @access  Private (Solo usuarios logueados)
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingDetails, totalAmount } = req.body;

        // 1. Validaciones básicas
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No hay ítems en la orden' });
        }

        // 2. Crear la orden en memoria
        // Usamos req.user.id que viene del middleware verifyToken
        const newOrder = new Order({
            user: req.user.id, 
            items,
            shippingDetails,
            totalAmount,
            status: 'paid' // Simulamos que el pago fue exitoso en el frontend
        });

        // 3. Guardar en MongoDB
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
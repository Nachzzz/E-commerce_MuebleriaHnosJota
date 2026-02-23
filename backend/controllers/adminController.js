const Order = require('../models/order_model');
const Product = require('../models/producto_model');

exports.getDashboardStats = async (req, res) => {
    try {
        // 1. Ingresos totales (Suma de todos los totalAmount de órdenes pagadas)
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        // 2. Cantidad total de productos y órdenes
        const productsCount = await Product.countDocuments();
        const ordersCount = await Order.countDocuments({ status: 'paid' });

        // 3. Datos para el gráfico: Ventas por mes (últimos 6 meses)
        const salesByMonth = await Order.aggregate([
            { $match: { status: 'paid' } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    monto: { $sum: "$totalAmount" },
                    cantidad: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json({
            revenue: totalRevenue[0]?.total || 0,
            productsCount,
            ordersCount,
            salesByMonth // Esto irá directo al gráfico
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estadísticas" });
    }
};
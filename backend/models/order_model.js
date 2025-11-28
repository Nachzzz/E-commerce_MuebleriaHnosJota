const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // 1. Relación con el Usuario
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 2. Lista de Productos comprados
    items: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto',
                required: true
            },
            nombre: { type: String, required: true }, // Guardamos el nombre por si cambia el producto original
            cantidad: { type: Number, required: true, min: 1 },
            precio: { type: Number, required: true, min: 0 }, // Precio al momento de la compra
            imagen: { type: String }
        }
    ],

    // 3. Datos de Envío (Vienen del Checkout)
    shippingDetails: {
        nombre: { type: String, required: true },
        email: { type: String, required: true },
        direccion: { type: String, required: true },
        ciudad: { type: String, required: true },
        codPostal: { type: String, required: true }
    },

    // 4. Totales y Estado
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
        default: 'paid' // Asumimos 'paid' porque es una simulación de pago exitoso
    },
    
    // Fecha de creación automática (createdAt)
}, {
    timestamps: true 
});

module.exports = mongoose.model('Order', OrderSchema);
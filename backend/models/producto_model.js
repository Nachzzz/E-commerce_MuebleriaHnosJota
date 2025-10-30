const mongoose = require('mongoose');

// El nombre del esquema se usa en mayúscula inicial para convención
const ProductoSchema = new mongoose.Schema({
    // --- CAMPOS BASE REQUERIDOS ---
    nombre: {
        type: String, 
        required: [true, 'El nombre del producto es obligatorio.'], 
        // unique: true es útil si el nombre es la clave, pero puede dar problemas si hay variaciones ligeras. 
        // Lo quito para flexibilidad a menos que sea un requisito de negocio.
        trim: true // Quita espacios en blanco al inicio/final
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number, 
        required: [true, 'El precio es obligatorio.'],
        min: [0, 'El precio no puede ser negativo.'] // Validacion estricta
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo.'] // Validacion estricta
    },
    imagenUrl: {
        type: String,
        trim: true
    },

    // --- CAMPOS ADICIONALES DE TU JSON ---
    descripcion1: { // Usado para descripción larga
        type: String,
        trim: true
    },
    valoracion: {
        type: Number,
        min: 1,
        max: 5
    },
    tipo: String, // Ejemplo: Aparador, Silla
    material: String,
    acabado: String,
    medidas: String,
    tiempo: String, // Tiempo de envío/fabricación
}, {
    timestamps: true // BUENA PRÁCTICA: Añade campos createdAt y updatedAt
});

const Producto = mongoose.model('Producto', ProductoSchema, 'products');

module.exports = Producto;

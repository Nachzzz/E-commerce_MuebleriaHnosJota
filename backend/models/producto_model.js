const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
    // --- CAMPOS BASE REQUERIDOS ---
    nombre: {
        type: String, 
        required: [true, 'El nombre del producto es obligatorio.'], 
        // unique: true es útil si el nombre es la clave, pero puede dar problemas si hay variaciones ligeras.
        trim: true // aquí quito espacios en blanco al inicio/final
    },
    descripcion: {
        type: String,
        trim: true
    },
    precio: {
        type: Number, 
        required: [true, 'El precio es obligatorio.'],
        min: [0, 'El precio no puede ser negativo.'] // validacion
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'El stock no puede ser negativo.'] // validacion
    },
    imagenUrl: {
        type: String,
        trim: true
    },

    // --- CAMPOS ADICIONALES DEL JSON ---
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
    tiempo: String,
}, {
    timestamps: true // Añado campos createdAt y updatedAt para uso futuro
});

const Producto = mongoose.model('Producto', ProductoSchema, 'products');

module.exports = Producto;

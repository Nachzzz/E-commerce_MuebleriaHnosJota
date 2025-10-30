// --- CONFIGURACIÓN DE DEPENDENCIAS ---
// Requisitos: npm install mongoose fs dotenv
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv'); 
const path = require('path'); // Módulo para construir rutas de forma segura

// 1. CARGAR VARIABLES DE ENTORNO
dotenv.config(); 

// 2. OBTENER LA URI DE CONEXIÓN
const MONGODB_URI = process.env.DB_URL; 

if (!MONGODB_URI) {
    console.error("❌ ERROR: La variable DB_URL no está definida en el archivo .env. ¡Asegúrate de que está en la raíz!");
    process.exit(1);
}

// 3. DEFINIR EL ESQUEMA DE PRODUCTO (debe coincidir con producto_model.js)
const productSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    imagenUrl: { type: String, trim: true }, 
    
    // Campos adicionales de tu JSON:
    descripcion1: { type: String, trim: true },
    valoracion: Number,
    tipo: String,
    material: String,
    acabado: String,
    medidas: String,
    tiempo: String,
});

const Product = mongoose.model('Product', productSchema);

// 4. FUNCIÓN PRINCIPAL DE IMPORTACIÓN
const importData = async () => {
    
    // CORRECCIÓN CRÍTICA DE LA RUTA: 
    // Como seeder.js está en la carpeta 'backend', solo necesitamos ir a 'data'.
    const JSON_PATH = path.resolve(__dirname, 'data', 'productos.json');

    try {
        // LECTURA DE DATOS
        const productsFromJson = JSON.parse(
            fs.readFileSync(JSON_PATH, 'utf-8')
        );
        
        await mongoose.connect(MONGODB_URI);
        
        console.log('✅ Conexión exitosa a la base de datos.');

        // 4.1. Limpiar colección (opcional pero recomendado)
        await Product.deleteMany();
        console.log('✅ Colección de productos limpiada.');
        
        // 4.2. Mapear e Insertar (Ajusta 'imagen' a 'imagenUrl')
        const productsToInsert = productsFromJson.map(p => ({
            ...p,
            imagenUrl: p.imagen, 
        }));

        await Product.insertMany(productsToInsert);
        console.log('🎉 11 productos importados correctamente en la colección "products".');
        process.exit(0); // Éxito
    } catch (err) {
        // Manejo de errores
        if (err.code === 'ENOENT') {
            console.error('\n❌ ERROR: Archivo no encontrado. Se buscó en:');
            console.error(`--> ${JSON_PATH}`);
            console.error('Por favor, verifica la ruta y la existencia del archivo.');
        } else if (err.name === 'MongoError' || err.name === 'MongooseError') {
             console.error('\n❌ ERROR DE BASE DE DATOS:');
             console.error('Verifica si tu URI de conexión es correcta y si tu IP está autorizada en Atlas.');
        } else {
            console.error('\n❌ ERROR FATAL durante la importación:', err.message);
        }
        process.exit(1); // Falla
    }
};

// 5. EJECUTAR
importData();
const mongoose = require('mongoose');

const strConnection = process.env.DB_URL;

exports.connectDB = async () => {
    if (!strConnection) {
        throw new Error ('El string de conexion , DB_URL, no está definido en las variables de entorno.');
    }

    await mongoose.connect(strConnection);
    console.log('Conectado a la base de datos MongoDB ✅');
}
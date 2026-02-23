const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuramos Cloudinary con tus variables de entorno
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuramos el almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'muebleria_avatars', // Así se llamará la carpeta dentro de tu Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'], // Formatos permitidos
    transformation: [{ width: 500, height: 500, crop: 'limit' }] // Achica imágenes gigantes para ahorrar espacio
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
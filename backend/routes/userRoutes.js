const router = require('express').Router();
const userController = require('../controllers/userController');
const upload = require('../middlewares/upload'); 
// CORRECCIÓN: Desestructuramos para obtener la función exacta
const { verifyToken } = require('../middlewares/auth'); 

// RUTA DE REGISTRO
router.post('/registro', userController.registerUser);

// RUTA DE LOGIN
router.post('/login', userController.loginUser);

// NUEVA RUTA: SUBIR AVATAR
// CORRECCIÓN: Usamos verifyToken en lugar del objeto auth entero
router.put('/avatar', verifyToken, upload.single('image'), userController.uploadAvatar);

module.exports = router;
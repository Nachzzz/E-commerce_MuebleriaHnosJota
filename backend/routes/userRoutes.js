const router = require('express').Router();

// Importar el controlador
const userController = require('../controllers/userController');

// RUTA DE REGISTRO
router.post('/registro', userController.registerUser);

// RUTA DE LOGIN
router.post('/login', userController.loginUser);

module.exports = router;
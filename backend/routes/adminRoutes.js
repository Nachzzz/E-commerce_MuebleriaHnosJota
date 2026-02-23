const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middlewares/auth');

// Solo los administradores logueados pueden ver esto
router.get('/stats', verifyToken, verifyAdmin, adminController.getDashboardStats);

module.exports = router;
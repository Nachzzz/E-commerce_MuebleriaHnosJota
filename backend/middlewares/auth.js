const jwt = require('jsonwebtoken');
const User = require('../models/usuario_model'); 

exports.verifyToken = (req, res, next) => {
    // 1. Obtener header (Express maneja mayúsculas/minúsculas automáticamente)
    const tokenHeader = req.header('Authorization');
    
    // DEBUG: Ver en la terminal del backend qué llega
    console.log(">>> Middleware verifyToken - Header recibido:", tokenHeader);

    if (!tokenHeader) {
        return res.status(401).json({ message: 'Acceso denegado. Header Authorization faltante.' });
    }

    try {
        // 2. Limpiar el prefijo 'Bearer ' si existe
        let token = tokenHeader;
        if (tokenHeader.startsWith('Bearer ')) {
            token = tokenHeader.slice(7, tokenHeader.length).trim();
        }

        // 3. Verificar firma
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error(">>> Error verificando token:", error.message);
        res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

exports.verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
             return res.status(404).json({ message: 'Usuario no encontrado en BD.' });
        }

        console.log(`>>> Verificando rol para usuario: ${user.username}, Rol: ${user.role}`);

        if (user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Requieres permisos de Administrador.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error interno verificando permisos.' });
    }
};
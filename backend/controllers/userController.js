// backend/controllers/userController.js
const User = require('../models/usuario_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @desc    Registra un nuevo usuario
 * @route   POST /api/usuarios/registro
 */
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Verificamos si el usuario o email ya existen
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El email o nombre de usuario ya está en uso.' });
        }

        // 2. Hasheamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Creamos y guardamos el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();

        // 4. Respondemos al frontend (sin enviar la contraseña)
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
};

/**
 * @desc    Loguea un usuario
 * @route   POST /api/usuarios/login
 */
exports.loginUser = async (req, res) => {
    try {
        // 1. Buscamos al usuario por su email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Usamos un mensaje genérico por seguridad
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 2. Comparamos la contraseña enviada con la hasheada en la BD
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        // 3. Si las credenciales son correctas, generamos el JWT
        // NOTA: Se asume que 'process.env.JWT_SECRET' está definido en tu .env
        const token = jwt.sign(
            { id: user._id, username: user.username }, 
            process.env.JWT_SECRET,                   
            { expiresIn: '1h' }                        
        );

        // 4. Respondemos con el token y datos del usuario (sin el password)
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
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

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El email o nombre de usuario ya está en uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        const savedUser = await newUser.save();

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
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            },
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

/**
 * @desc    Sube o actualiza la foto de perfil del usuario
 * @route   PUT /api/usuarios/avatar
 */
exports.uploadAvatar = async (req, res) => {
    try {
        // req.file lo genera Multer cuando termina de subir la imagen a Cloudinary
        if (!req.file) {
            return res.status(400).json({ message: 'No se proporcionó ninguna imagen.' });
        }

        // Esta es la URL pública que Cloudinary nos devuelve
        const imageUrl = req.file.path;

        // Buscamos al usuario por su ID (que viene del token de autenticación) y lo actualizamos
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, // Tu middleware auth seguramente guarda los datos del token en req.user
            { avatar: imageUrl },
            { new: true } // Para que devuelva el documento actualizado y no el viejo
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({
            message: 'Avatar actualizado exitosamente',
            avatar: updatedUser.avatar,
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        console.error('Error en uploadAvatar:', error);
        res.status(500).json({ message: 'Error interno del servidor al subir avatar.' });
    }
};
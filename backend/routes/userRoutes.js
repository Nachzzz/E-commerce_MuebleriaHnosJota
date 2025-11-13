// routes/userRoutes.js
const router = require('express').Router();
const User = require('../models/usuario_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// RUTA DE REGISTRO
router.post('/registro', async (req, res) => {
    try {
        // 1. Recibimos los datos del formulario
        const { username, email, password } = req.body;

        // 2. Verificamos si el usuario o email ya existen
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'El email o nombre de usuario ya está en uso.' });
        }

        // 3. Hasheamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Creamos el nuevo usuario con la contraseña hasheada
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        // 5. Guardamos el usuario en la base de datos
        const savedUser = await newUser.save();

        // 6. Respondemos al frontend (sin enviar la contraseña)
        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email,
        });

    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor', error });
    }
});


// RUTA DE LOGIN
router.post('/login', async (req, res) => {
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
        const token = jwt.sign(
            { id: user._id, username: user.username }, // Payload: datos que queremos en el token
            process.env.JWT_SECRET,                   // La clave secreta desde .env
            { expiresIn: '1h' }                        // Opciones (ej: expira en 1 hora)
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
});

module.exports = router;
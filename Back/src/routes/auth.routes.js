/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Rutas de autenticacion
 * 
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electronico
 *         password:
 *           type: string
 *           description: Contraseña
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electronico
 *         password: 
 *           type: string
 *           description: Contraseña
 *     
 *     AuthResponse: 
 *       type: object
 *       properties: 
 *         accessToken:
 *           type: string
 *           description: Token de acceso
 *         refreshToken:
 *           type: string
 *           description: Token de refresco
 *      
 *     RefreshRequest:
 *       type: object
 *       required: 
 *         - refreshToken
 *       properties:
 *         refreshToken:
 *           type: string
 *           description: token de refresco
 *     
 *     RefreshResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Nuevo token de acceso
 */

const express = require('express');
const router = express.Router();

const { requiredFields } = require('../middlewares/validation.middleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Registrar usuario nuevo
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       "201":
 *         description: Usuario creado
 *       "400":
 *         description: Datos invalidos o usuario ya existente
 *       "500":
 *         description: Error de servidor
 */
router.post('/signup', requiredFields(['nombre', 'email', 'password']), async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        if (await User.exists({ email })) {
            return res.status(400).json({ message: 'El email ya esta en uso' });
        };

        const passwordHash = await bcrypt.hash(password, parseInt(process.env.HASH_ITERATIONS, 10) || 10);
        const newUser = await User.create({ nombre, email, passwordHash });

        return res.status(201).json({
            message: 'Created new user',
            id: newUser._id,
            nombre: newUser.nombre,
            email: newUser.email,
            rol: newUser.rol
        });
    } catch (e) {
        console.error('Error al signup', e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticacion de usuario
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       "200":
 *         description: Token generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       "400":
 *         description: Informacion incompleta
 *       "401":
 *         description: Login invalido
 *       "500":
 *         description: Errror de servidor
 */
router.post('/login', requiredFields(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email ? email.toLowerCase() : email });
        const match = await bcrypt.compare(password, user.passwordHash);

        if (!user || !match) return res.status(401).json({ error: 'Datos no validos' });

        const payload = { sub: user.id, roles: user.rol };
        // TODO probar los tiempo de los tokens (expiresIn 1m)
        const accessToken = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '45m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: '2h' });

        return res.json({ accessToken, refreshToken });
    } catch (e) {
        console.error('Error en login', e);
        return res.status(500).json({ message: 'Error de servidor' })
    }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renueva el token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       "200":
 *         description: Nuevo token generado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshResponse'
 *       "400":
 *         description: Token faltante
 *       "401":
 *         description: Token invalido 
 */
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ error: 'Falta token' });

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        const accesToken = jwt.sign(
            { sub: payload.sub, roles: payload.roles },
            process.env.JWT_KEY,
            { expiresIn: '45m' }
        );
        res.json({ accesToken });
    } catch (err) {
        res.status(401).json({ error: 'Token invalido' });
    }
});

module.exports = router;
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

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * @swagger
 * /api/auth/singup:
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
 */
router.post('/singup', async (req, res) => {

    //TO DO logica de singup

    res.status(201).json({ message: 'Created new user' });
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
 *       "401":
 *         description: Datos invalidos
 */
router.post('/login', async (req, res) => {
    //TO DO login 
    res.json({ token: 'xxxx' });
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
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios
 */


const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middlewares/auth.middleware');
const user = require('../models/User');
const jwt = require('jsonwebtoken');

//TODO en principio todos los endpoint ADMIN



/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Lista de usuarios
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', async (req, res) => {

    // TODO filtros
    // const filters = req.query; 
    //const users = await Users.find(filters)

    res.json({});
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por Id
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del usuario 
 *     responses:
 *       "200":
 *         description: Datos del usuario
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "404":
 *         description: Usuario no encontrado
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params
    res.json({});
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear usuario nuevo
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewUser'
 *     responses:
 *       "201":
 *         description: Usuario creado correctamente
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: Datos no validos o insuficientes
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 */
// solo para pruebas, se deben generar usuarios al registraste
router.post('/', authenticate, authorize('ADMIN'), async (req, res) => {
    // TODO logica de creacion 
    res.status(201).json({});
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: editar los datos de usuario
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del usuario editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               rol:
 *                 type: string
 *                 enum:
 *                   - USER
 *                   - ADMIN
 *     responses:
 *       "200":
 *         description: Usuario actualizado
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: Datos no validos o insuficientes
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 */
router.put('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params
    // TODO logica edicion
    res.json({});
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por Id
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del usuario eliminado
 *     responses:
 *       "204":
 *         description: Usuario eliminado
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 */
// valorar si para otros usuarios
router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params
    // TODO logica eliminacion
    res.status(204).end();
});

/**
 * @swagger
 * /api/users/{id}/password:
 *   patch:
 *     summary: Cambio de contraseña de usuario
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Contraseña actual
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña
 *     responses:
 *       "200":
 *         description: Contraseña actualizada
 *       "400":
 *         description: Datos no validos o incorrectos
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 */
router.patch('/:id/password', authenticate, async (req, res) => {
    const { id } = req.params
    const { oldPassword, newPassword } = req.body;
    // TODO logica de cambio de contraseña
    res.json({ mesagge: 'Contraseña actualizada' });
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Mostrar datos del usuario autenticado
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: No autenticado
 */
router.get('/me', authenticate, async (req, res) => {
    const me = await user.findById(req.userId).select('-passwordHash');
    res.json(me);
});

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Cambiar rol de usuario
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum:
 *                   - USER
 *                   - ADMIN
 *     responses:
 *       "200":
 *         description: Rol actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: Datos no validos o incorrectos
 *       "401":
 *         description: No autenticado
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 */
router.patch('/:id/role', authenticate, authorize('ADMIN'), async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    //TODO validar role y actualizar
    const updated = await UserActivation.findIdAndUpdate(id, { role: role }, { new: true })
        .select('-passwordhash');
    res.json(updated);
});

module.exports = router;
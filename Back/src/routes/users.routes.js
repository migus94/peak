/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios
 */

const { validateInt } = require('../middlewares/validation.middleware');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtra usuarios por nombre
 *     responses:
 *       "200":
 *         description: Lista de usuarios
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       "401":
 *         description: Token faltante
 *       "403": 
 *         description: No autorizado
 *       "500":
 *         description: Error de servidor
 */
router.get('/', authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const { name } = req.query;
        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }

        const users = await user.find(filter).select('-passwordHash');
        return res.json(users)

    } catch (e) {
        console.log("Error al listar usuarios ", e);
        return res.status(500).json({ message: "Error de servidor" });
    }
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
 *         description: Token faltante
 *       "404":
 *         description: Usuario no encontrado 
 *       "500":
 *         description: Error de servidor
 */
router.get('/me', authenticate, async (req, res) => {
    try {
        const me = await User.findById(req.userId).select('-passwordHash');
        if (!me) {
            return res.status(404).json({ message: `Usuario no encontrado` });
        }
        return res.json(me);
    } catch (e) {
        console.error('Error al obtener datos de usuario autenticado', e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
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
 *           type: integer
 *         description: Id publico del usuario 
 *     responses:
 *       "200":
 *         description: Datos del usuario
 *         content: 
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "400":
 *         description: Id invalido
 *       "401":
 *         description: Token faltante
 *       "403": 
 *         description: No autorizado
 *       "404":
 *         description: Usuario no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.get('/:id', validateInt('id'), authenticate, authorize('ADMIN'), async (req, res) => {
    try {
        const publicId = req.params.id
        const user = await User.findOne({ publicId }).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        return res.json(user);
    } catch (e) {
        return res.status(500).json({ message: "Error de servidor" });
    }
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
 *           type: integer
 *         description: Id publico del usuario editado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
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
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.put('/:id', validateInt('id'), authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id;

    try {
        const foundUser = await User.findOne({ publicId });
        if (!foundUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const fields = ['name', 'email', 'rol'];
        const updates = fields.reduce((updatedObject, key) => {
            const value = req.body[key]
            if (value) { // != null
                const parsedValue = (key === 'email')
                    ? String(value).toLowerCase().trim()
                    : String(value).trim();
                if (parsedValue !== foundUser[key]) {
                    updatedObject[key] = parsedValue;
                }
            }
            return updatedObject;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(200).json({ message: 'No se detectaron cambios', user: foundUser });
        }
        const updatedUser = await User
            .findOneAndUpdate({ publicId }, updates, { new: true }).select('-passwordHash');
        return res.json(updatedUser);
    } catch (e) {
        console.error(`Error al actualizar usuario ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    };
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
 *           type: integer
 *         description: Id publico del usuario eliminado
 *     responses:
 *       "204":
 *         description: Usuario eliminado
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 *       "500":
 *         description: Error de servidor
 */
// valorar si para otros usuarios
router.delete('/:id', validateInt('id'), authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id;
    try {
        const userDeleted = await User.findOneAndDelete({ publicId });
        if (!userDeleted) {
            return res.status(404).json({ message: `Usuario ${publicId} no encontrado` });
        }
        return res.status(204).end();
    } catch (e) {
        console.error(`Error al eliminar usuario ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
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
 *           type: integer
 *         description: Id publico del usuario
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
 *         description: Token faltante
 *       "404": 
 *         description: Usuario no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.patch('/:id/password', validateInt('id'), authenticate, async (req, res) => {
    const publicId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Contraseña nueva y antigua requerida' });
    }

    try {
        const user = await User.findOne({ publicId });
        if (!user) {
            return res.status(404).json({ message: `Usuario ${publicId} no encontrado` });
        }

        const match = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!match) {
            return res.status(400).json({ message: `Contraseña incorrecta` });
        }

        user.passwordHash = await bcrypt
            .hash(newPassword, parseInt(process.env.HASH_ITERATIONS, 10) || 10);
        await user.save();
        return res.json({ message: 'Contraseña actualizada' });

    } catch (e) {
        console.error(`Error al cambiar contraseña de usuario ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

/**
 * @swagger
 * /api/users/{id}/rol:
 *   patch:
 *     summary: Cambiar rol de un usuario
 *     tags: 
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id publico del usuario
 *     responses:
 *       "200":
 *         description: Rol actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       "401":
 *         description: Token faltante
 *       "403":
 *         description: No autorizado
 *       "404": 
 *         description: Usuario no encontrado
 *       "500":
 *         description: Error de servidor
 */
router.patch('/:id/rol', validateInt('id'), authenticate, authorize('ADMIN'), async (req, res) => {
    const publicId = req.params.id;

    try {
        const updatedUser = await User.findOne({ publicId }).select('-passwordHash');

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const newRol = updatedUser.rol === 'USER' ? 'ADMIN' : 'USER';
        updatedUser.rol = newRol;

        await updatedUser.save();
        return res.json(updatedUser);
    } catch (e) {
        console.error(`Error al cambiar el rol del usuario ${publicId}`, e);
        return res.status(500).json({ message: 'Error de servidor' });
    }
});

module.exports = router;
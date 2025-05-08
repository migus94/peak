/**
 * @swagger
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
 *           descripcion: Contraseña en texto (Se obtiene el Hash postetiormente)
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - nombre
 *         - email
 *         - passwordHash
 *       properties:
 *         _id:
 *           type: string
 *           description: Id generado por MongoDB
 *         nombre: 
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electronico 
 *         passwordHash:
 *           type: string
 *           description: hash de la contraseña
 *         rol:
 *           type: string
 *           enum:
 *             - USER
 *             - ADMIN
 *           description: Rol del usuario
 */

const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowecase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    rol: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
});

module.exports = model('User', userSchema);
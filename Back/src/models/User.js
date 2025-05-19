/**
 * @swagger
 * components:
 *   schemas:
 *     NewUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name: 
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electronico 
 *         password:
 *           type: string
 *           descripcion: Contraseña en texto (Se obtiene el Hash postetiormente)
 *     User:
 *       type: object
 *       required:
 *         - publicId
 *         - name
 *         - email
 *         - passwordHash
 *       properties:
 *         publicId:
 *           type: number
 *           description: Id publico del usuario
 *         name: 
 *           type: string
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electronico 
 *         passwordHash:
 *           type: string
 *           description: hash de la contraseña
 *         _id:
 *           type: string
 *           description: Id generado por MongoDB
 *         rol:
 *           type: string
 *           enum:
 *             - USER
 *             - ADMIN
 *           description: Rol del usuario
 */

const { Schema, model } = require('mongoose');
const Counter = require('../models/Counter');

const userSchema = new Schema({
    publicId: {
        type: Number,
        unique: true
    },
    name: {
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

userSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        delete ret._id;
        return ret;
    }
});

userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: 'User' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.publicId = counter.seq;
    }
    next();
});

module.exports = model('User', userSchema);
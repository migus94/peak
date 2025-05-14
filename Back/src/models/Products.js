/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - publicId
 *         - titulo
 *         - descripcion
 *         - precio
 *         - imagenPrincipal
 *         - stock
 *       properties:
 *         publocId:
 *           type: number
 *           description: Id publico incremental de producto
 *         _id:
 *           type: string
 *           description: Id generado por MongoDB
 *         titulo: 
 *           type: string
 *           description: Título del producto
 *         descripcion:
 *           type: string
 *           description: Descripción detallada
 *         precio:
 *           type: number
 *           description: Precio en euros
 *         valoracion: 
 *           type: number
 *           description: valoracion media 0-5
 *         imagenPrincipal:
 *           type: string
 *           description: URL de la imagen principal del producto
 *         imagenes:
 *           type: array
 *           items:
 *             type: string
 *           description: URL de las imagenes del producto
 *         stock:
 *           type: number
 *           description: Disponibilidad del producto
 *           default: 0
 */

const { Schema, model } = require('mongoose');
const Counter = require('../models/Counter');

const productSchema = new Schema({
    publicId: {
        type: Number,
        unique: true
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    valoracion: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    imagenPrincipal: {
        type: String,
        required: true,
        trim: true
    },
    imagenes: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        required: true,
        default: 1000,
        min: 0
    }
});

productSchema.index({
    titulo: 'text',
    descripcion: 'text'
});

productSchema.pre('save', async function (next) {
    if (this.isNew) {
        const counter = await Counter.findOneAndUpdate(
            { name: 'Product' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.publicId = counter.seq;
    }
    next();
});

module.exports = model('Products', productSchema);
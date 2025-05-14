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
 *           default: 'DEFAULT'
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
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    mainImage: {
        type: String,
        trim: true,
        default: 'DEFAULT'
    },
    images: {
        type: [String],
        default: []
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    }
});

productSchema.set('toJSON', {
    versionKey: false,
    transform: (_doc, ret) => {
        delete ret._id;
        return ret;
    }
});

productSchema.index({
    title: 'text',
    description: 'text'
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
/**
 * @swagger
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - titulo
 *         - descripcion
 *         - precio
 *         - imagenPrincipal
 *       properties:
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
 */

const { Schema, model } = require('mongoose');

const productSchema = new Schema({
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
    }
});

productSchema.index({
    titulo: 'text',
    descripcion: 'text'
});

module.exports = model('Products', productSchema);
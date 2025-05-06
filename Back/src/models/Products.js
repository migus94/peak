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
    }
});

module.exports = model('Products', productSchema);
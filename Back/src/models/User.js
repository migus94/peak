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
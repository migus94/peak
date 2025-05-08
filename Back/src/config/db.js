const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('conexion a atlas');
    } catch (error) {
        console.error('fallo de conexion: ', err);
        process.exit(1);
    }
};

module.exports = { connectDB }
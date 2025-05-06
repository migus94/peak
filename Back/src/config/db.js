const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        console.log('conexion a atlas');
    } catch (error) {
        console.error('fallo de conexion: ', err);
        process.exit(1);
    }
};

module.exports = { connectDB, client }
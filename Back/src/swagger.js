const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'peakApi',
            version: '1.0.0',
            description: 'Documentacion API Peak'
        },
        Servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        }
    },
    apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
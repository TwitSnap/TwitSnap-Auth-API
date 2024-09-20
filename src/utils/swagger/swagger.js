const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'
const endpointsFiles = [ "../../api/routes/*.ts" ]

const doc = {
    info: {
      title: 'Auth API',
      description: 'Auth microservice API',
    },
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch(err => {
    console.error('Error generating Swagger documentation:', err);
});
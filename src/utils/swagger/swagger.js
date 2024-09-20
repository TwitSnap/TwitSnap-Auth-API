const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'
const endpointsFiles = [ "../../api/routes/*.ts" ]

const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: process.env.LOCAL_HOST || "localhost:5000",
    schemes: ['http',"https"],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    console.log('Swagger documentation generated successfully.');
}).catch(err => {
    console.error('Error generating Swagger documentation:', err);
});
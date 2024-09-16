const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: 'localhost:5000'
  };
const outputFile = './swagger_output.json'
const endpointsFiles = [
    "../routes/*.ts",
]



swaggerAutogen(outputFile, endpointsFiles,doc)
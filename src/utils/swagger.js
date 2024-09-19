require("dotenv").config();


const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
      title: 'My API',
      description: 'Description'
    },
    host: process.env.LOCAL_HOST || "localhost:5000",
    schemes: ['http',"https"],
  };
const outputFile = './swagger_output.json'
const endpointsFiles = [
    "../routes/*.ts",
]



swaggerAutogen(outputFile, endpointsFiles,doc)
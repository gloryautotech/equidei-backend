const swaggerAutogen = require('swagger-autogen')();

// swagger config
const doc = {
	info: {
		title: 'EQUIDEI API',
		description: 'EQUIDEI spec for Swagger',
	},
	schemes: ['http', 'https'],
};

const outputFile = './docs/swagger.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

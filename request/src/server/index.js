const RequestRepository = require('../repository');
const RequestService = require('../service');
const RequestController = require('../controller');
const express = require('express');
const { buildHandlers } = require('./handlers');

module.exports = () => {

	const envParams = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		interval: process.env.INTERVAL,
		secretKey: process.env.SECRET_KEY
	};

	const notPresentEnvParams = Object.keys(envParams).filter(envParam => !envParams[envParam]).join(', ');

	if (notPresentEnvParams) {
		throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentEnvParams}`);
	}

	const repository = new RequestRepository(envParams);
	const service = new RequestService({ repository, interval: parseInt(envParams.interval) });
	const controller = new RequestController({ service, secretKey: envParams.secretKey });

	const { getKey, putKey } = buildHandlers(controller);

	const server = express();

	server.use(express.json());

	server.get('/:key', getKey);

	server.put('/:key', putKey);

	server.use((error, request, response, next) => {
		console.log(error);
		response.status(500).json({ message: error.message });
	});

	server.listen(parseInt(process.env.PORT || '3003'));
}

const RequestRepository = require('./repository');
const RequestService = require('./service');
const RequestController = require('./controller');
const express = require('express');
const asyncHandler = require('express-async-handler');
const mapRequest = require('common/src/mapRequest');

const envParams = {
    host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	interval: process.env.INTERVAL,
    password: process.env.DB_PASSWORD
};

const notPresentEnvParams = Object.keys(envParams).filter(envParam => !envParams[envParam]).join(', ');

if (notPresentEnvParams) {
    throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentEnvParams}`);
}

const repository = new RequestRepository(envParams);
const service = new RequestService({repository, interval: parseInt(envParams.interval)});
const controller = new RequestController({service, secretKey: ''});

const server = express();

server.use(express.json());

server.get('/:key', asyncHandler(async (request, response, next) => {
    try {
		const result = await controller.getCountForLastInterval(mapRequest(request));
        response.status(200).send(JSON.stringify(result));
    } catch (error) {
        next(error);
    }
}));

server.put('/:key', asyncHandler(async (request, response, next) => {
    try {
		await controller.recordRequest(mapRequest(request));
        response.status(200).end();
    } catch (error) {
        next(error);
    }
}));

server.use((error, request, response, next) => {
    console.log(error);
    response.status(500).json({ message: error.message });
});

server.listen(parseInt(process.env.PORT || '3003'));

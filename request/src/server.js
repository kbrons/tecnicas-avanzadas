const RequestRepository = require('./repository');
const RequestService = require('./service');
const RequestController = require('./controller');
const express = require('express');
const asyncHandler = require('express-async-handler');
const mapRequest = require('common/src/mapRequest');

const dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD
};

const notPresentDbParams = Object.keys(dbParams).filter(dbParameter => !dbParams[dbParameter]).join(', ');

if (notPresentDbParams) {
    throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentDbParams}`);
}

const repository = new RequestRepository(dbParams);
const service = new RequestService(repository);
const controller = new RequestController(service);

const server = express();

server.use(express.json());

server.get('/:key', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.getCountForLastInterval(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.put('/:key', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.recordRequest(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.use((error, request, response, next) => {
    console.log(error);
    response.status(500).json({ message: error.message });
});

server.listen(parseInt(process.env.PORT || '3002'));

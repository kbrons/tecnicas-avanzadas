const FinancialStatusRepository = require('./repository');
const FinancialStatusService = require('./service');
const FinancialStatusController = require('./controller');
const express = require('express');
const asyncHandler = require('express-async-handler');
const mapRequest = require('common/src/mapRequest');

const dbParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const notPresentDbParams = Object.keys(dbParams).filter(dbParameter => !dbParams[dbParameter]).join(', ');

if (notPresentDbParams) {
    throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentDbParams}`);
}

const repository = new FinancialStatusRepository(dbParams);
const service = new FinancialStatusService(repository);
const controller = new FinancialStatusController(service);

const server = express();

server.use(express.json());

server.get('/account/:accountKey', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.get(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.delete('/account/:accountKey', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.delete(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.put('/account', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.create(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.get('/authorize', asyncHandler(async (request, response, next) => {
    try {
        await controller.authorize(mapRequest(request));
        response.status(204).end();
    } catch (error) {
        next(error);
    }
}));

server.get('/authorizeAdmin', asyncHandler(async (request, response, next) => {
    try {
        await controller.authorizeAdmin(mapRequest(request));
        response.status(204).end();
    } catch (error) {
        next(error);
    }
}));

server.use((error, request, response, next) => {
    console.log(error);
    response.status(500).json({ message: error.message });
});

server.listen(parseInt(process.env.PORT || '3001'));

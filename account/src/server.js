const AccountRepository = require('./repository');
const AccountService = require('./service');
const AccountController = require('./controller');
const express = require('express');
const asyncHandler = require('express-async-handler');

const envParams = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	requestServiceURL: process.env.REQUEST_URL,
	requestServiceKey: process.env.REQUEST_KEY
};

const notPresentEnvParams = Object.keys(envParams).filter(envParameter => !envParams[envParameter]).join(', ');

if (notPresentEnvParams) {
    throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentEnvParams}`);
}

const repository = new AccountRepository(envParams);
const service = new AccountService({repository, requestServiceURL: envParams.requestServiceURL, requestServiceKey: envParams.requestServiceKey});
const controller = new AccountController(service);

const server = express();

server.use(express.json());

server.get('/account/:accountKey', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.get({key: request.header('Authorization'), parameters: request.params}));
    } catch (error) {
        next(error);
    }
}));

server.delete('/account/:accountKey', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.delete({key: request.header('Authorization'), parameters: request.params}));
    } catch (error) {
        next(error);
    }
}));

server.put('/account', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.create({key: request.header('Authorization'), parameters: request.body}));
    } catch (error) {
        next(error);
    }
}));

server.post('/account', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.update({key: request.header('Authorization'), parameters: request.body}));
    } catch (error) {
        next(error);
    }
}));

server.get('/authorize', asyncHandler(async (request, response, next) => {
    try {
        await controller.authorize({key: request.header('Authorization')});
        response.status(204).end();
    } catch (error) {
        next(error);
    }
}));

server.get('/authorizeAdmin', asyncHandler(async (request, response, next) => {
    try {
        await controller.authorizeAdmin({key: request.header('Authorization')});
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

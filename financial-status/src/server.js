const FinancialStatusRepository = require('./repository');
const FinancialStatusService = require('./service');
const FinancialStatusController = require('./controller');
const express = require('express');

const dbParams = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

const notPresentDbParams = Object.keys(dbParams).filter(dbParameter => !dbParams[dbParameter]).join();

if (notPresentDbParams) {
    throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentDbParams}`);
}

const repository = new FinancialStatusRepository(dbParams);
const service = new FinancialStatusService(repository);
const controller = new FinancialStatusController(service);

const server = express();

server.get('/:cuit', async (request, response) => {
    const key = request.header('Authorization');
    const { cuit } = request.params;
    response.status(200).send(await controller.get({key, parameter: cuit}));
});

server.post('/', async (request, response) => {
    const key = request.header('Authorization');
    const cuits = request.body;
    response.status(200).send(await controller.get({key, parameter: cuits}));
});


server.route('/').get(async (request, response) => {
    const key = request.header('Authorization');
    try {
        response.send(await controller.get({key, parameter: request.body}));
        response.status(200);
    } catch (error) {
        console.error(error);
        response.send(error);
        response.status(500);
    }
    response.end();
}).post(async (request, response))

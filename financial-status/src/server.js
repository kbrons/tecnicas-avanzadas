const FinancialStatusRepository = require('./repository');
const FinancialStatusService = require('./service');
const FinancialStatusController = require('./controller');
const express = require('express');
const asyncHandler = require('express-async-handler');
const mapRequest = require('common/src/mapRequest');

const { getEnvParams } = require('./getEnvParams');

const envParams = getEnvParams();

const repository = new FinancialStatusRepository(envParams);
const service = new FinancialStatusService(repository);
const controller = new FinancialStatusController({service, accountServiceURL: envParams.accountServiceURL});

const server = express();

server.use(express.json());

server.get('/:cuit', asyncHandler(async (request, response, next) => {
    try {
        response.status(200).send(await controller.get(mapRequest(request)));
    } catch (error) {
        next(error);
    }
}));

server.post('/', asyncHandler(async (request, response, next) => {
    try {
        await controller.addOrUpdate(mapRequest(request));
        response.status(200).end();
    } catch (error) {
        next(error);
    }
}));

server.use((error, request, response, next) => {
    console.log(error);
    response.status(500).json({ message: error.message });
});

server.listen(parseInt(process.env.PORT || '3000'));

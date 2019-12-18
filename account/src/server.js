const AccountRepository = require('./repository');
const AccountService = require('./service');
const AccountController = require('./controller');
const express = require('express');
const { buildHandlers } = require('./server/handlers');

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

const { getKey, deleteKey, putAccount, postAccount, authorize, authorizeAdmin } = buildHandlers({controller});

server.get('/account/:accountKey', getKey);

server.delete('/account/:accountKey', deleteKey);

server.put('/account', putAccount);

server.post('/account', postAccount);

server.get('/authorize', authorize);

server.get('/authorizeAdmin', authorizeAdmin);

server.use((error, request, response, next) => {
    console.log(error);
    response.status(500).json({ message: error.message });
});

server.listen(parseInt(process.env.PORT || '3001'));

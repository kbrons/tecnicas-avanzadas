const utils = require('./utils');
const fetch = require('node-fetch');

class FinancialStatusController {
    constructor({service, accountServiceURL}) {
        this._service = service;
        this._accountServiceURL = accountServiceURL;
    }

    async _authenticate(key) {
        if (!key) {
            throw new Error('An API key is required');
        }

        await fetch(`${this._accountServiceURL}/authorize/${key}`);
    }

    async addOrUpdate({financialStatuses, key}) {
        await this._authenticate(key);

        if (!financialStatuses || !Array.isArray(financialStatuses)) {
            throw new Error('An array of financial statuses is required');
        }

        await this._service.addOrUpdate(financialStatuses);
    }

    async get({parameter, key}) {
        await this._authenticate(key);

        return utils.callForStringOrArray({argument: parameter, stringCallback: cuit => this._getSingle(cuit), arrayCallback: cuits => this._getSeveral(cuits)});
    }

    async _getSingle(parameter) {
        const financialStatus = await this._service.get(parameter);
        return this._mapToJSON(financialStatus);
    }

    async _getSeveral(parameter) {
        const financialStatuses = await this._service.get(parameter);
        return `[${financialStatuses.map(financialStatus => this._mapToJSON(financialStatus)).join()}]`;
    }

    _mapToJSON(financialStatus) {
        const { status, cuit } = financialStatus;
        return JSON.stringify({cuit, status});
    }
}

module.exports = FinancialStatusController;
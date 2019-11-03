const utils = require('common/src/utils');
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

        const result = await fetch(`${this._accountServiceURL}/authorize`, {method: 'GET', headers: {'Authorization': key}}).then(async response => ({
            status: response.status,
            body: (response.status < 200 || response.status >= 300) ? await response.json() : ''
        }));

        console.log(`Authorize result: ${JSON.stringify(result)}`);

        if (result.status < 200 || result.status >= 300) {
            throw new Error(result.body.message);
        }
    }

    async addOrUpdate({ key, parameters }) {
        await this._authenticate(key);
        const financialStatuses = parameters;
        if (!financialStatuses || !Array.isArray(financialStatuses)) {
            throw new Error('An array of financial statuses is required');
        }

        await this._service.addOrUpdate(financialStatuses);
    }

    async get({ key, parameters }) {
        await this._authenticate(key);

        const parameter = Object.values(parameters)[0];

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
const utils = require('./utils');

class FinancialStatusController {
    constructor(service) {
        this._service = service;
    }

    get({parameter, key}) {
        if (!key) {
            throw new Error('An API key is required');
        }

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
        return JSON.stringify({status, cuit});
    }
}

module.exports = FinancialStatusController;
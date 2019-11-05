
module.exports = class RequestController {
	constructor({service, secretKey}) {
		this._service = service;
		this._secretKey = secretKey;
	}

	_authorizeKey(key) {
		if (key !== this._secretKey) {
			throw new Error('Unauthorized');
		}
	}

	_validateParameters(parameters) {
		if (!parameters.key) {
			throw new Error('The key is required');
		}
	}

	getCountForLastInterval({key, parameters}) {
		this._authorizeKey(key);
		this._validateParameters(parameters);
		return this._service.getCountForLastInterval(parameters.key);
	}

	async recordRequest({key, parameters}) {
		this._authorizeKey(key);
		this._validateParameters(parameters)
		await this._service.recordRequest(parameters.key);
	}
}

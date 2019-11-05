const Request = require('./model/request');

module.exports = class RequestService{ 
	constructor({interval, repository}) {
		this._interval = interval;
		this._repository = repository;
	}

	getCountForLastInterval(key) {
		return this._repository.getCountForLastInterval({key, intervalOffset: this._interval});
	}

	recordRequest(key) {
		if (!key) {
			throw new Error('The key is required');
		}

		const request = new Request({key});
		return this._repository.create(request);
	}
}

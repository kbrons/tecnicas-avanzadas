const Request = require('./model/request');

module.exports = class RequestService{ 
	constructor({interval, repository}) {
		this._interval = interval;
		this._repository = repository;
	}

	getCountForLastInterval(key) {
		return this._repository.getCountForLastInterval({key, intervalOffset: this._interval});
	}

	async recordRequest(key) {
		const request = new Request({key});
		await this._repository.create(request);
	}
}

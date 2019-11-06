const { fetch } = require('common/src/fetchService');

class AccountService {
	constructor({ repository, requestServiceURL, requestServiceKey }) {
		this._repository = repository;
		this._requestServiceURL = requestServiceURL;
		this._requestServiceKey = requestServiceKey;
	}

	async _logRequest(key) {
		if (!key) {
			throw new Error('An API key is required');
		}

		return await fetch({ url: `${this._requestServiceURL}/${key}`, method: 'PUT',headers: { 'Authorization': this._requestServiceKey } });
	}

	async _getRequestCountForLastInterval(key) {
		if (!key) {
			throw new Error('An API key is required');
		}

		return await fetch({ url: `${this._requestServiceURL}/${key}`, headers: { 'Authorization': this._requestServiceKey } });
	}

	async _getAuthorizeInformation(key) {
		try {
			const [userResponse, requestCountResponse] = await Promise.all([this._repository.get(key), this._getRequestCountForLastInterval(key)]);
			return {
				user: userResponse,
				requestCount: requestCountResponse
			};
		}
		catch (error) {
			console.log(error);
		}

		return {};
	}

	_validateRequestCount({ user, requestCount }) {
		if (user.requestLimit > -1 && requestCount + 1 > user.requestLimit) {
			throw new Error('The request limit has been reached for this account');
		}
	}

	async authorize(key) {
		const { user, requestCount } = await this._getAuthorizeInformation(key);

		if (!user || !Number.isInteger(requestCount)) {
			throw new Error('The account is not authorized to perform this operation');
		}

		this._validateRequestCount({ user, requestCount });

		await this._logRequest(key);
	}

	async authorizeAdmin(key) {
		const { user, requestCount } = await this._getAuthorizeInformation(key);

		if (!user || !user.isAdmin || !requestCount) {
			throw new Error('The account is not authorized to perform this operation');
		}

		this._validateRequestCount({ user, requestCount });
		
		await this._logRequest(key);
	}

	async create({ key, newAccount }) {
		await this.authorizeAdmin(key);
		await this._repository.create(newAccount);
	}

	async get({ key, accountKey }) {
		await this.authorizeAdmin(key);
		return this._repository.get(accountKey);
	}

	async delete({ key, accountKey }) {
		await this.authorizeAdmin(key);
		await this._repository.delete(accountKey);
	}
}

module.exports = AccountService;
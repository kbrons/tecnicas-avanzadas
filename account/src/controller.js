const Account = require('./model/account');

class AccountController {
    constructor(service) {
        this._service = service;
    }

    _validate(key) {
        if (!key) {
            throw new Error('An API key is required');
        }
    }

    authorize({key}) {
        this._validate(key);

        return this._service.authorize(key);
    }

    authorizeAdmin({key}) {
        this._validate(key);

        return this._service.authorizeAdmin(key);
    }

    create({key, parameters}) {
        this._validate(key);

        const newAccount = new Account(parameters);
        return this._service.create({key, newAccount});
    }

    delete({key, parameters: { accountKey }}) {
        this._validate(key);

        return this._service.delete({key, accountKey});
    }

    async get({ key, parameters: { accountKey } }) {
        this._validate(key);

        const account = await this._service.get({key, accountKey});
        return this._mapToJSON(account);
    }

    _mapToJSON(account) {
        return JSON.stringify(account);
    }
}

module.exports = AccountController;
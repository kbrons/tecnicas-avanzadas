const utils = require('./utils');
const Account = require('./model/account');

class AccountService {
    constructor(repository) {
        this._repository = repository;
    }

    get(key) {
        return this._repository.get(cuit);
    }

    async create({key, newAccount}) {
        const creator = await this.get(key);

        if(!creator.isAdmin) {
            throw new Error('The provided key does not belong to an administrator');
        }

        await this._repository.create(newAccount);
    }
}

module.exports = AccountService;
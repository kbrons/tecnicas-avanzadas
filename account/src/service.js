const utils = require('./utils');
const Account = require('./model/account');

class AccountService {
    constructor(repository) {
        this._repository = repository;
    }

    async authorize(key) {
        try {
            await this._repository.get(key);
        }
        catch (error) {
            console.log(error);
            throw new Error('The account is not authorized to perform this operation');
        }
    }

    async authorizeAdmin(key) {
        let user;
        try {
            user = await this._repository.get(key);
        }
        catch (error) {
            console.log(error);
        }
        
        if(!user || !user.isAdmin) {
            throw new Error('The account is not authorized to perform this operation');
        }
    }

    async create({key, newAccount}) {
        await this.authorizeAdmin(key);
        await this._repository.create(newAccount);
    }

    async get({key, accountKey}) {
        await this.authorizeAdmin(key);
        return this._repository.get(accountKey);
    }

    async delete({key, accountKey}) {
        await this.authorizeAdmin(key);
        await this._repository.delete(accountKey);
    }
}

module.exports = AccountService;
const mariadb = require('mariadb');
const Account = require('./model/account');
const utils = require('./utils');
const tableName = `ACCOUNT`;

class AccountRepository {
    constructor({host, port, user, password, database, connectionLimit = 5}) {
        this._connectionPool = mariadb.createPool({host, port, user, password, database, connectionLimit});
    }

    async get(key) {
        if(!key || !utils.isString(key)) {
            throw new Error('A key is required');
        }

        const dbResult = await this._connectionPool.query(`SELECT key, name, is_admin AS isAdmin FROM ${tableName} WHERE key = ?`, [key]);
        
        if (dbResult.length < 1) {
            throw new Error(`The key ${key} does not exist in the database`);
        }

        const {name, isAdmin} = dbResult[0];

        return new Account({name, isAdmin, key});
    }

    async create(account) {
        if(!account || !(account instanceof Account)) {
            throw new Error('An account is required');
        }

        const escape = this._connectionPool.escape;

        const dbResult = await this._connectionPool.query(`INSERT INTO ${tableName} (\`key\`. \`name\`, \`is_admin\`) VALUES (${escape(account.key)}, ${escape(account.name)}, ${escape(account.isAdmin)})`);

        if(!dbResult || dbResult.affectedRows !== 1) {
            throw new Error('There was an error creating the new account');
        }
    }

    async delete(key) {
        if(!key || !utils.isString(key)) {
            throw new Error('A key is required');
        }

        const dbResult = await this._connectionPool.query(`DELETE FROM ${tableName} WHERE key = ?`, [key]);

        if(!dbResult || dbResult.affectedRows !== 1) {
            throw new Error('There was an error deleting the new account');
        }
    }
}

module.exports = AccountRepository;

const mariadb = require('mariadb');
const Account = require('./model/account');
const utils = require('common/src/utils');
const tableName = `ACCOUNT`;

class AccountRepository {
    constructor({host, port, user, password, database, connectionLimit = 5}) {
        this._connectionPool = mariadb.createPool({host, port, user, password, database, connectionLimit});
        this._dbName = database;
    }

    async get(key) {
        if(!key || !utils.isString(key)) {
            throw new Error('A key is required');
        }

        const dbResult = await this._connectionPool.query(`SELECT \`key\`, name, is_admin AS isAdmin, request_limit AS requestLimit FROM ${tableName} WHERE \`key\` = ?`, [key]);
        
        if (dbResult.length < 1) {
            throw new Error(`The key ${key} does not exist in the database`);
        }

        const {name, isAdmin, requestLimit} = dbResult[0];

        return new Account({name, isAdmin: isAdmin ? true : false, key, requestLimit});
    }

    async create(account) {
        if(!account || !(account instanceof Account)) {
            throw new Error('An account is required');
        }

        const escape = this._connectionPool.escape;

        const dbResult = await this._connectionPool.query(`INSERT INTO \`${this._dbName}\`.\`${tableName}\` (\`key\`, \`name\`, \`is_admin\`, \`request_limit\`) VALUES (${escape(account.key)}, ${escape(account.name)}, ${account.isAdmin ? 1 : 0}, ${account.requestLimit})`);

        if(!dbResult || dbResult.affectedRows !== 1) {
            throw new Error('There was an error creating the new account');
        }
	}
	
	async update(account) {
        if(!account || !(account instanceof Account)) {
            throw new Error('An account is required');
        }

        const escape = this._connectionPool.escape;

        const dbResult = await this._connectionPool.query(`UPDATE \`${this._dbName}\`.\`${tableName}\` SET \`request_limit\` = ${account.requestLimit} WHERE \`key\` = ${escape(account.key)}`);

        if(!dbResult || dbResult.affectedRows !== 1) {
            throw new Error('There was an error updating the account');
        }
    }

    async delete(key) {
        if(!key || !utils.isString(key)) {
            throw new Error('A key is required');
        }

        const dbResult = await this._connectionPool.query(`DELETE FROM ${tableName} WHERE \`key\` = ?`, [key]);

        if(!dbResult || dbResult.affectedRows !== 1) {
            throw new Error('There was an error deleting the new account');
        }
    }
}

module.exports = AccountRepository;

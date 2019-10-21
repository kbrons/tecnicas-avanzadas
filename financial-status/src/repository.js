const mariadb = require('mariadb');
const FinancialStatus = require('./model/financialStatus');
const utils = require('./utils');

class FinancialStatusRepository {
    constructor({host, user, password, database, connectionLimit = 5}) {
        this._connectionPool = mariadb.createPool({host, user, password, database, connectionLimit});
    }

    get (argument) {
        return utils.callForStringOrArray({argument, stringCallback: parameter => this._getSingle(parameter), arrayCallback: parameter => this._getSeveral(parameter)});
    }

    async _getSeveral(cuits) {
        const dbResult = await this._connectionPool.query(`SELECT financial_status AS status, cuit FROM FINANCIAL_STATUS WHERE cuit IN (${cuits.map(() => '?').join(', ')})`, [...cuits]);
        return dbResult.map(({status, cuit}) => new FinancialStatus({status, cuit}));
    }

    async _getSingle(cuit) {
        const dbResult = await this._connectionPool.query('SELECT financial_status AS status FROM FINANCIAL_STATUS WHERE cuit = ?', [cuit]);
        
        if (dbResult.length < 1) {
            throw new Error(`The CUIT ${cuit} does not exist in the database`);
        }

        const {status} = dbResult[0];

        return new FinancialStatus({status, cuit});
    }

    async addOrUpdate(statuses) {
        
    }
}

module.exports = FinancialStatusRepository;
const mariadb = require('mariadb');
const FinancialStatus = require('./model/financialStatus');

class FinancialStatusRepository {
    constructor({host, user, password, database, connectionLimit = 5}) {
        this._connectionPool = mariadb.createPool({host, user, password, database, connectionLimit});
    }

    get (argument) {
        if(!argument) {
            return Promise.reject(Error('A parameter is required'));
        }
        else if (!Array.isArray(argument) && (typeof argument !== 'string')) {
            return Promise.reject(Error('The parameter must be a string ir array of strings'));
        }

        return Array.isArray(argument) ? this._getSeveral(argument) : this._getSingle(argument);
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
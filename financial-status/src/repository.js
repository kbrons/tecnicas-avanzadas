const mariadb = require('mariadb');
const FinancialStatus = require('./model/financialStatus');
const utils = require('./utils');
const tableName = `FINANCIAL_STATUS`;

class FinancialStatusRepository {
    constructor({host, port, user, password, database, connectionLimit = 5}) {
        this._connectionPool = mariadb.createPool({host, port, user, password, database, connectionLimit});
    }

    get (argument) {
        return utils.callForStringOrArray({argument, stringCallback: parameter => this._getSingle(parameter), arrayCallback: parameter => this._getSeveral(parameter)});
    }

    async _getSeveral(cuits) {
        const dbResult = await this._connectionPool.query(`SELECT financial_status AS status, cuit FROM ${tableName} WHERE cuit IN (${cuits.map(() => '?').join(', ')})`, [...cuits]);
        return dbResult.map(({status, cuit}) => new FinancialStatus({status, cuit}));
    }

    async _getSingle(cuit) {
        const dbResult = await this._connectionPool.query(`SELECT financial_status AS status FROM ${tableName} WHERE cuit = ?`, [cuit]);
        
        if (dbResult.length < 1) {
            throw new Error(`The CUIT ${cuit} does not exist in the database`);
        }

        const {status} = dbResult[0];

        return new FinancialStatus({status, cuit});
    }

    async addOrUpdate(statuses) {
        if(!statuses || !Array.isArray(statuses)) {
            throw new Error(`The parameter is not valid`);
        }

        const mapToSQLInsertOrUpdate = createMapToSQLInsertOrUpdate(this._connectionPool);
        const query = statuses.map(mapToSQLInsertOrUpdate).join('');
        await this._connectionPool.query(query);
    }
}

module.exports = FinancialStatusRepository;

const createMapToSQLInsertOrUpdate = pool => status => `
    INSERT INTO ${tableName} (\`financial_status\`, \`dni\`, \`cuit\`, \`full_name\`) 
    VALUES (${pool.escape(status.status)}, ${pool.escape(status.dni)}, ${pool.escape(status.cuit)}, ${pool.escape(status.name)})
    ON DUPLICATE KEY UPDATE
    financial_status=${pool.escape(status.status)}, full_name=${pool.escape(status.name)};
`;

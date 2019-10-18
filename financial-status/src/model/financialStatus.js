
class FinancialStatus {
    constructor({status, cuit, dni, name }) {
        this.status = status;
        this.cuit = cuit;
        
        if (dni) {
            this.dni = dni;
        }

        if (name) {
            this.name = name;
        }
    }
}

module.exports = FinancialStatus;
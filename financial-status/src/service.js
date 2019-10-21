const utils = require('./utils');

const validCuitTypes = ["20", "23", "24", "27", "30", "33", "34"];
const validationSequence = [2, 3, 4, 5, 6, 7];
Array.prototype.reverseInPlace = function() {
    const reversed = this.reverse();
    this.splice(0, this.length, ...reversed);
    return this;
};

class FinancialStatusService {
    constructor(repository) {
        this._repository = repository;
    }

    _validate (cuit) {
        if (!cuit) {
            throw new Error('The CUIT doesn\'t have a value');
        }

        let separatedCuit = cuit.split('-');

        if (separatedCuit.length !== 3) {
            throw new Error('The CUIT should be separated by hyphens');
        }

        if (!validCuitTypes.includes(separatedCuit[0])) {
            throw new Error('The CUIT type is not valid');
        }

        console.log(`Separated cuit: (${separatedCuit[0]})-(${separatedCuit[1]})-(${separatedCuit[2]})`)
        let sequenceCounter = 0;
        const acumulador = separatedCuit[0]
            .split('')
            .concat(separatedCuit[1].split(''))
            .reverseInPlace()
            .map(value => {
                const result = parseInt(value) * validationSequence[sequenceCounter];
                sequenceCounter++;
                if (sequenceCounter >= validationSequence.length) {
                    sequenceCounter = 0;
                }
                return result;
            })
            .reduce((previous, current) => previous + current, 0);

        let verificador = 11 - (acumulador % 11);
        verificador = verificador === 11 ? 0 : verificador;

        if(verificador.toString() !== separatedCuit[2]) {
            throw new Error('The CUIT verification digit is not valid');
        }
    }

    get(argument) {
        return utils.callForStringOrArray({argument, stringCallback: parameter => this._getSingle(parameter), arrayCallback: parameter => this._getSeveral(parameter)});
    }

    async _getSingle(cuit) {

    }

    async _getSeveral(cuits) {

    }
}

module.exports = FinancialStatusService;
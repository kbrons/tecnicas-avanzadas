const validationSequence = [2, 3, 4, 5, 6, 7];
Array.prototype.reverseInPlace = function() {
    const reversed = this.reverse();
    this.splice(0, this.length, ...reversed);
    return this;
};

const cuits = require('./cuits.json');
const fs = require('fs');

const fixedCuits = cuits.map((cuit) => {
    let separatedCuit = cuit.split('-');
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
    separatedCuit[2] = verificador;

    return separatedCuit.join('-');
});

fs.writeFileSync('./fixedCuits.json', JSON.stringify(fixedCuits));

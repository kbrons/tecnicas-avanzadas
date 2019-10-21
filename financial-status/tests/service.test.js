const Service = require('../src/service');

describe('Financial Status Service', () => {
    it('Should return when the CUIT is valid', () => {
        const cuit = "23-39916309-9";
        const sut = new Service();

        expect(sut._validate(cuit)).toBeUndefined();
    });
});
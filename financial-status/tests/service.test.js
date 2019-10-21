const Service = require('../src/service');

describe('Financial Status Service', () => {
    it('Should return when the CUIT is valid', () => {
        const cuit = "23-39916309-9";
        const sut = new Service();

        expect(sut._validate(cuit)).toBeUndefined();
    });

    it('Should throw an error when the CUIT is undefined', () => {
        const cuit = undefined;
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT doesn\'t have a value');
    });

    it('Should throw an error when the CUIT is not separated by hyphens', () => {
        const cuit = "23399163099";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT should be separated by hyphens');
    });

    it('Should throw an error when the CUIT type is not valid', () => {
        const cuit = "1-39916309-9";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT type is not valid');
    });

    it('Should throw an error when the CUIT verification digit is not valid', () => {
        const cuit = "23-39916309-5";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT verification digit is not valid');
    });
});
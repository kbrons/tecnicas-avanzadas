const Controller = require('../src/controller');
const utils = require('../src/utils');

describe('Financial Status Controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When it doesn\'t receive a key, it should throw an error', () => {
        const sut = new Controller();

        expect(() => sut.get({})).toThrowError('An API key is required');
    });

    it('When calling get, it should call callToStringOrArray with the right parameters', () => {
        jest.spyOn(utils, 'callForStringOrArray').mockImplementation(() => {});
        const cuit = "23-39916309-5";
        const mockKey = 'MockAPIKey';

        const sut = new Controller();

        sut.get({parameter: cuit, key: mockKey});

        expect(utils.callForStringOrArray).toHaveBeenCalledWith({argument: cuit, stringCallback: expect.any(Function), arrayCallback: expect.any(Function)});
    });
});
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

    it('When calling with a single CUIT, it should call the service and return the result as JSON', async () => {
        const cuit = "23-39916309-5";
        const mockServiceResponse = {cuit, status: 5};
        const mockKey = 'MockAPIKey';

        const mockService = {
            get: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        const sut = new Controller(mockService);

        const result = await sut._getSingle(cuit);

        expect(mockService.get).toHaveBeenCalledWith(cuit);
        expect(result).toEqual(JSON.stringify(mockServiceResponse));
    });

    it('When calling with an array of CUITs, it should call the service and return the result as JSON', async () => {
        const cuit = "23-39916309-5";
        const cuits = [cuit];
        const mockServiceResponse = [{cuit, status: 5}];
        const mockKey = 'MockAPIKey';

        const mockService = {
            get: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        const sut = new Controller(mockService);

        const result = await sut._getSeveral(cuits);

        expect(mockService.get).toHaveBeenCalledWith(cuits);
        expect(result).toEqual(JSON.stringify(mockServiceResponse));
    });
});
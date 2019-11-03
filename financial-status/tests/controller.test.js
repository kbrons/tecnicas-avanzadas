const fetch = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());
const Controller = require('../src/controller');
const utils = require('../src/utils');

describe('Financial Status Controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When calling authenticate and it doesn\'t receive a key, it should throw an error', async () => {
        const sut = new Controller({});

        await expect(sut._authenticate()).rejects.toThrowError('An API key is required');
    });

    it('When calling authenticate with a key, it should call fetch with the right URL', async () => {
        const mockAccountURL = 'http://mock.com/';
        const mockKey = 'mockKey';
        const expectedURL = `${mockAccountURL}/authorize`;
        fetch.mockResolvedValue();
        const sut = new Controller({accountServiceURL: mockAccountURL});

        await expect(sut._authenticate(mockKey)).resolves.toBeUndefined();
        expect(fetch).toHaveBeenCalledWith(expectedURL, {method: 'GET', headers: {'Authorization': mockKey}});
    });

    it('When calling get, it should call callToStringOrArray with the right parameters', async () => {
        jest.spyOn(utils, 'callForStringOrArray').mockImplementation(() => { });
        jest.spyOn(Controller.prototype, '_authenticate').mockResolvedValue();
        const cuit = "23-39916309-5";
        const mockKey = 'MockAPIKey';

        const sut = new Controller({});

        await sut.get({ parameter: cuit, key: mockKey });

        expect(utils.callForStringOrArray).toHaveBeenCalledWith({ argument: cuit, stringCallback: expect.any(Function), arrayCallback: expect.any(Function) });
        expect(Controller.prototype._authenticate).toHaveBeenCalledWith(mockKey);
    });

    it('When calling with a single CUIT, it should call the service and return the result as JSON', async () => {
        const cuit = "23-39916309-5";
        const mockServiceResponse = { cuit, status: 5 };

        const mockService = {
            get: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        const sut = new Controller({ service: mockService });

        const result = await sut._getSingle(cuit);

        expect(mockService.get).toHaveBeenCalledWith(cuit);
        expect(result).toEqual(JSON.stringify(mockServiceResponse));
    });

    it('When calling with an array of CUITs, it should call the service and return the result as JSON', async () => {
        const cuit = "23-39916309-5";
        const cuits = [cuit];
        const mockServiceResponse = [{ cuit, status: 5 }];

        const mockService = {
            get: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        const sut = new Controller({ service: mockService });

        const result = await sut._getSeveral(cuits);

        expect(mockService.get).toHaveBeenCalledWith(cuits);
        expect(result).toEqual(JSON.stringify(mockServiceResponse));
    });

    it('When calling addOrUpdate without an array, it should throw an error', async () => {
        const cuit = "23-39916309-5";
        const mockKey = 'MockAPIKey';
        jest.spyOn(Controller.prototype, '_authenticate').mockResolvedValue();

        const sut = new Controller({});

        await expect(sut.addOrUpdate({ financialStatuses: cuit, key: mockKey })).rejects.toThrowError('An array of financial statuses is required');
        expect(Controller.prototype._authenticate).toHaveBeenCalledWith(mockKey);
    });

    it('When calling with a single CUIT, it should call the service and return the result as JSON', async () => {
        const financialStatuses = [{ cuit: "23-39916309-5", status: 2 }];
        const mockServiceResponse = 'mockResponse';
        const mockKey = 'MockAPIKey';
        jest.spyOn(Controller.prototype, '_authenticate').mockResolvedValue();

        const mockService = {
            addOrUpdate: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        const sut = new Controller({ service: mockService });

        await expect(sut.addOrUpdate({ financialStatuses, key: mockKey })).resolves.toBeUndefined();
        expect(mockService.addOrUpdate).toHaveBeenCalledWith(financialStatuses);
        expect(Controller.prototype._authenticate).toHaveBeenCalledWith(mockKey);
    });
});
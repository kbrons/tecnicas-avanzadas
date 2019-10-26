const Service = require('../src/service');
const utils = require('../src/utils');

describe('Financial Status Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When the CUIT is valid, it should return', () => {
        const cuit = "23-39916309-9";
        const sut = new Service();

        expect(sut._validate(cuit)).toBeUndefined();
    });

    it('When the CUIT is undefined, it should throw an error', () => {
        const cuit = undefined;
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT doesn\'t have a value');
    });

    it('When the CUIT is not separated by hyphens, it should throw an error', () => {
        const cuit = "23399163099";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT should be separated by hyphens');
    });

    it('When the CUIT type is not valid, it should throw an error', () => {
        const cuit = "1-39916309-9";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT type is not valid');
    });

    it('When the CUIT verification digit is not valid, it should throw an error ', () => {
        const cuit = "23-39916309-5";
        const sut = new Service();

        expect(() => sut._validate(cuit)).toThrowError('The CUIT verification digit is not valid');
    });

    it('When calling get, it should call callToStringOrArray with the right parameters', () => {
        jest.spyOn(utils, 'callForStringOrArray').mockImplementation(() => {});
        const cuit = "23-39916309-9";

        const sut = new Service();

        sut.get(cuit);

        expect(utils.callForStringOrArray).toHaveBeenCalledWith({argument: cuit, stringCallback: expect.any(Function), arrayCallback: expect.any(Function)});
    });

    it('When calling with a single CUIT, it should validate it and call the repository', async () => {
        jest.spyOn(Service.prototype, '_validate').mockImplementation(() => {});

        const cuit = "23-39916309-9";
        const mockResponse = {cuit, status: 1};

        const repositoryMock = {
            get: jest.fn().mockImplementation(() => Promise.resolve(mockResponse))
        };

        const sut = new Service(repositoryMock);

        const result = await sut._getSingle(cuit);

        expect(result).toEqual(mockResponse);
        expect(sut._validate).toHaveBeenCalledWith(cuit);
        expect(repositoryMock.get).toHaveBeenCalledWith(cuit);
    });

    it('When calling with an array of CUITs, it should validate it and call the repository', async () => {
        jest.spyOn(Service.prototype, '_validate').mockImplementation(() => {});

        const cuits = ["23-39916309-9"];
        const mockResponse = [{cuit: cuits[0], status: 1}];

        const repositoryMock = {
            get: jest.fn().mockImplementation(() => Promise.resolve(mockResponse))
        };

        const sut = new Service(repositoryMock);

        const result = await sut._getSeveral(cuits);

        expect(result).toEqual(mockResponse);
        expect(sut._validate).toHaveBeenCalledWith(cuits[0]);
        expect(repositoryMock.get).toHaveBeenCalledWith(cuits);
    });

    it('When calling addOrUpdate without parameters, it should throw an error ', () => {
        const sut = new Service();

        expect(() => sut.addOrUpdate()).toThrowError('The financial statuses to add or update are required');
    });

    it('When calling addOrUpdate without an array, it should throw an error ', () => {
        const sut = new Service();

        expect(() => sut.addOrUpdate('test-value')).toThrowError('The financial statuses to add or update are required');
    });

    it('When calling addOrUpdate with an invalid CUIT, it should throw an error ', () => {
        jest.spyOn(Service.prototype, '_validate').mockImplementation(() => {throw new Error()});
        const cuit = "23-39916309-5";
        const cuits = [{
            cuit
        }];
        const sut = new Service();

        expect(() => sut.addOrUpdate(cuits)).toThrowError('Some financial statuses have missing information');
    });

    it('When calling addOrUpdate with an invalid CUIT, it should throw an error ', () => {
        jest.spyOn(Service.prototype, '_validate').mockImplementation(() => {throw new Error()});
        const cuit = "23-39916309-5";
        const cuits = [{
            cuit,
            status: 2
        }];
        const sut = new Service();

        expect(() => sut.addOrUpdate(cuits)).toThrowError(`The following CUITs are not valid: ${cuit}`);
    });

    it('When calling addOrUpdate with a valid array of CUITs, it should call the repository', async () => {
        jest.spyOn(Service.prototype, '_validate').mockImplementation(() => {});

        const cuits = [{cuit: "23-39916309-9", status: 2}];
        const mockResponse = 'mock-response';

        const repositoryMock = {
            addOrUpdate: jest.fn().mockResolvedValue(mockResponse)
        };

        const sut = new Service(repositoryMock);

        const result = await sut.addOrUpdate(cuits);

        expect(result).toEqual(mockResponse);
        expect(sut._validate).toHaveBeenCalledWith(cuits[0].cuit);
        expect(repositoryMock.addOrUpdate).toHaveBeenCalledWith(cuits);
    });
});
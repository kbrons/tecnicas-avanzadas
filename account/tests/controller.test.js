const Controller = require('../src/controller');
const Account = require('../src/model/account');

describe('Account Controller', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When calling mapToJSON with an account, it should return its JSON representation', () => {
        const mockAccount = {
            key: 'mockNewKey',
            name: 'mockName',
			isAdmin: false,
			requestLimit: -1
        };

        const expectedResult = `{\"key\":\"${mockAccount.key}\",\"name\":\"${mockAccount.name}\",\"isAdmin\":${mockAccount.isAdmin},\"requestLimit\":${mockAccount.requestLimit}}`;
        
        const sut = new Controller();

        const result = sut._mapToJSON(new Account(mockAccount));

        expect(result).toEqual(expectedResult);
    });

    it('When calling validate with a key, it should return', () => {
        const mockKey = 'mockKey';
        const sut = new Controller();

        expect(sut._validate(mockKey)).toBeUndefined();
    });

    it('When calling validate without a key, it should throw an error', () => {
        const sut = new Controller();

        expect(() => sut._validate()).toThrowError('An API key is required');
    });

    it('When calling authorize, it should validate it received a key and call the service', async () => {
        const mockKey = 'mockKey';
        const mockService = {
            authorize: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Controller.prototype, '_validate').mockReturnValue();

        const sut = new Controller(mockService);

        await expect(sut.authorize({key: mockKey})).resolves.toBeUndefined();
        expect(mockService.authorize).toHaveBeenCalledWith(mockKey);
        expect(Controller.prototype._validate).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin, it should validate it received a key and call the service', async () => {
        const mockKey = 'mockKey';
        const mockService = {
            authorizeAdmin: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Controller.prototype, '_validate').mockReturnValue();

        const sut = new Controller(mockService);

        await expect(sut.authorizeAdmin({key: mockKey})).resolves.toBeUndefined();
        expect(mockService.authorizeAdmin).toHaveBeenCalledWith(mockKey);
        expect(Controller.prototype._validate).toHaveBeenCalledWith(mockKey);
    });

    it('When calling get, it should validate it received a key, call the service and return the result as JSON', async () => {
        const mockKey = 'mockKey';
        const mockResponseKey = 'responseKey';
        const mockJSON = 'mockJSON';
        const mockServiceResponse = { mockResponseKey };
        const mockService = {
            get: jest.fn().mockResolvedValue(mockServiceResponse)
        };

        jest.spyOn(Controller.prototype, '_validate').mockReturnValue();
        jest.spyOn(Controller.prototype, '_mapToJSON').mockReturnValue(mockJSON);

        const sut = new Controller(mockService);

        const result = await sut.get({key: mockKey, parameters: {accountKey: mockResponseKey}});

        expect(result).toEqual(mockJSON);
        expect(mockService.get).toHaveBeenCalledWith({key: mockKey, accountKey: mockResponseKey});
        expect(Controller.prototype._validate).toHaveBeenCalledWith(mockKey);
        expect(Controller.prototype._mapToJSON).toHaveBeenCalledWith(mockServiceResponse);
    });

    it('When calling create, it should validate it received a key and call the service with an account', async () => {
        const mockKey = 'mockKey';
        const mockAccount = {
            key: 'mockNewKey',
            name: 'mockName',
            isAdmin: false
        };
        const mockService = {
            create: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Controller.prototype, '_validate').mockReturnValue();

        const sut = new Controller(mockService);

        await expect(sut.create({key: mockKey, parameters: mockAccount})).resolves.toBeUndefined();
        expect(mockService.create).toHaveBeenCalledWith({key: mockKey, newAccount: new Account(mockAccount)});
        expect(Controller.prototype._validate).toHaveBeenCalledWith(mockKey);
    });

    it('When calling delete, it should validate it received a key and call the service', async () => {
        const mockKey = 'mockKey';
        const mockKeyToDelete = 'mockDeleteKey';
        const mockService = {
            delete: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Controller.prototype, '_validate').mockReturnValue();

        const sut = new Controller(mockService);

        await expect(sut.delete({key: mockKey, parameters: {accountKey: mockKeyToDelete}})).resolves.toBeUndefined();
        expect(mockService.delete).toHaveBeenCalledWith({key: mockKey, accountKey: mockKeyToDelete});
        expect(Controller.prototype._validate).toHaveBeenCalledWith(mockKey);
    });
});
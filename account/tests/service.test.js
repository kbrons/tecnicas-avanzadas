const fetchModule = require('common/src/fetchService');
jest.mock('common/src/fetchService', () => ({fetch: jest.fn()}));
const Service = require('../src/service');
const Account = require('../src/model/account');

describe('Account Service', () => {
    afterEach(() => {
		jest.restoreAllMocks();
		fetchModule.fetch.mockReset();
    });

    it('When calling get, it should call the repository with the received key and return an account', async () => {
        const mockKey = 'mockKey';
        const mockAdminKey = 'mockKey';
        const mockResponse = {
            key: mockKey,
            name: 'mockname',
			isAdmin: false,
			requestLimit: -1
        };

        const repositoryMock = {
            get: jest.fn().mockResolvedValue(new Account(mockResponse))
        };

        jest.spyOn(Service.prototype, 'authorizeAdmin').mockResolvedValue();

        const sut = new Service({repository: repositoryMock});

        const result = await sut.get({key: mockAdminKey, accountKey: mockKey});

        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
        expect(Service.prototype.authorizeAdmin).toHaveBeenCalledWith(mockAdminKey);
        expect(result).toBeInstanceOf(Account);
        expect(result).toEqual(mockResponse);
    });

    it('When calling create, it should check the permissions of the key and create the account', async () => {
        const mockKey = 'mockKey';

        const mockNewAccount = {
            key: 'test',
            name: 'test',
            isAdmin: false
        };

        const repositoryMock = {
            create: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Service.prototype, 'authorizeAdmin').mockResolvedValue();

        const sut = new Service({repository: repositoryMock});

        await sut.create({key: mockKey, newAccount: mockNewAccount});

        expect(Service.prototype.authorizeAdmin).toHaveBeenCalledWith(mockKey);
        expect(repositoryMock.create).toHaveBeenCalledWith(mockNewAccount);
    });

    it('When calling authorize with an existing user, it should return', async () => {
        const mockKey = 'mockKey';
		const mockUser = {key: mockKey};
		const mockRequestCount = 5;

		jest.spyOn(Service.prototype, '_getAuthorizeInformation').mockResolvedValue({user: mockUser, requestCount: mockRequestCount});
		jest.spyOn(Service.prototype, '_validateRequestCount').mockReturnValue();

        const sut = new Service({});

		await expect(sut.authorize(mockKey)).resolves.toBeUndefined();
		expect(Service.prototype._getAuthorizeInformation).toHaveBeenCalledWith(mockKey);
		expect(Service.prototype._validateRequestCount).toHaveBeenCalledWith({user: mockUser, requestCount: mockRequestCount});
    });

    it('When calling authorize with a non-existing user, it should throw an error', async () => {
		const mockKey = 'mockKey';
		
		jest.spyOn(Service.prototype, '_getAuthorizeInformation').mockResolvedValue({});

        const sut = new Service({});

        await expect(sut.authorize(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
        expect(Service.prototype._getAuthorizeInformation).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin with an existing admin user, it should return', async () => {
		const mockKey = 'mockKey';
		const mockUser = {key: mockKey, isAdmin: true};
		const mockRequestCount = 5;

		jest.spyOn(Service.prototype, '_getAuthorizeInformation').mockResolvedValue({user: mockUser, requestCount: mockRequestCount});
		jest.spyOn(Service.prototype, '_validateRequestCount').mockReturnValue();

        const sut = new Service({});

        await expect(sut.authorizeAdmin(mockKey)).resolves.toBeUndefined();
		expect(Service.prototype._getAuthorizeInformation).toHaveBeenCalledWith(mockKey);
		expect(Service.prototype._validateRequestCount).toHaveBeenCalledWith({user: mockUser, requestCount: mockRequestCount});
    });

    it('When calling authorizeAdmin with a non-existing user, it should throw an error', async () => {
        const mockKey = 'mockKey';

		jest.spyOn(Service.prototype, '_getAuthorizeInformation').mockResolvedValue({});
        const sut = new Service({});

        await expect(sut.authorizeAdmin(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
		expect(Service.prototype._getAuthorizeInformation).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin with an existing not admin user, it should throw an error', async () => {
		const mockKey = 'mockKey';
		const mockUser = {key: mockKey, isAdmin: false};
		const mockRequestCount = 5;

		jest.spyOn(Service.prototype, '_getAuthorizeInformation').mockResolvedValue({user: mockUser, requestCount: mockRequestCount});

        const sut = new Service({});

        await expect(sut.authorizeAdmin(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
        expect(Service.prototype._getAuthorizeInformation).toHaveBeenCalledWith(mockKey);
    });

    it('When calling delete, it should call authorizeAdmin and the repository', async () => {
        const mockAdminKey = 'mockAdminKey';
        const mockKey = 'mockKey';
        const repositoryMock = {
            delete: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Service.prototype, 'authorizeAdmin').mockResolvedValue();        

        const sut  = new Service({repository: repositoryMock});

        await expect(sut.delete({key: mockAdminKey, accountKey: mockKey})).resolves.toBeUndefined();
        expect(Service.prototype.authorizeAdmin).toHaveBeenCalledWith(mockAdminKey);
        expect(repositoryMock.delete).toHaveBeenCalledWith(mockKey);
	});
	
	it('When calling _getAuthorizeInformation, it should call the repository and getCount, and return their results', async () => {
		const mockKey = 'mockKey';
		const mockUser = {key: mockKey, isAdmin: true};
		const mockRequestCount = 5;
		const repositoryMock = {
            get: jest.fn().mockResolvedValue(mockUser)
        };

		jest.spyOn(Service.prototype, '_getRequestCountForLastInterval').mockResolvedValue(mockRequestCount);

        const sut = new Service({repository: repositoryMock});

        await expect(sut._getAuthorizeInformation(mockKey)).resolves.toStrictEqual({user: mockUser, requestCount: mockRequestCount});
		expect(Service.prototype._getRequestCountForLastInterval).toHaveBeenCalledWith(mockKey);
		expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
	});

	it('When calling _getAuthorizeInformation and get user fails, it should return an empty object', async () => {
		const mockKey = 'mockKey';
		const mockRequestCount = 5;
		const repositoryMock = {
            get: jest.fn().mockRejectedValue()
        };

		jest.spyOn(Service.prototype, '_getRequestCountForLastInterval').mockResolvedValue(mockRequestCount);

        const sut = new Service({repository: repositoryMock});

        await expect(sut._getAuthorizeInformation(mockKey)).resolves.toStrictEqual({});
		expect(Service.prototype._getRequestCountForLastInterval).toHaveBeenCalledWith(mockKey);
		expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
	});

	it('When calling _getAuthorizeInformation and get count fails, it should return an empty object', async () => {
		const mockKey = 'mockKey';
		const mockUser = {key: mockKey, isAdmin: true};
		const repositoryMock = {
            get: jest.fn().mockResolvedValue(mockUser)
        };

		jest.spyOn(Service.prototype, '_getRequestCountForLastInterval').mockRejectedValue();

        const sut = new Service({repository: repositoryMock});

        await expect(sut._getAuthorizeInformation(mockKey)).resolves.toStrictEqual({});
		expect(Service.prototype._getRequestCountForLastInterval).toHaveBeenCalledWith(mockKey);
		expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
	});

	it('When calling _validateRequestCount and the request limit is -1, it should return', () => {
		const mockUser = {requestLimit: -1};
		const mockRequestCount = 5;

        const sut = new Service({});

        expect(sut._validateRequestCount({user: mockUser, requestCount: mockRequestCount})).toBeUndefined();
	});

	it('When calling _validateRequestCount and the request limit is lower than the count, it should return', () => {
		const mockUser = {requestLimit: 5};
		const mockRequestCount = 2;

        const sut = new Service({});

        expect(sut._validateRequestCount({user: mockUser, requestCount: mockRequestCount})).toBeUndefined();
	});

	it('When calling _validateRequestCount and the request limit is equal than the count, it should throw an error', () => {
		const mockUser = {requestLimit: 5};
		const mockRequestCount = 5;

        const sut = new Service({});

        expect(() => sut._validateRequestCount({user: mockUser, requestCount: mockRequestCount})).toThrowError('The request limit has been reached for this account');
	});

	it('When calling getCount and it doesn\'t receive a key, it should throw an error', async () => {
        const sut = new Service({});

        await expect(sut._getRequestCountForLastInterval()).rejects.toThrowError('An API key is required');
    });

    it('When calling getCount with a key, it should call fetch with the right URL', async () => {
        const mockRequestURL = 'http://mock.com';
		const mockKey = 'mockKey';
		const mockSecretKey = 'mockSecretKey';
		const expectedURL = `${mockRequestURL}/${mockKey}`;
		const mockCount = 5;
		jest.spyOn(fetchModule, 'fetch').mockResolvedValue(mockCount);
        const sut = new Service({accountServiceURL: mockRequestURL, requestServiceKey: mockSecretKey, requestServiceURL: mockRequestURL});

        await expect(sut._getRequestCountForLastInterval(mockKey)).resolves.toStrictEqual(mockCount);
        expect(fetchModule.fetch).toHaveBeenCalledWith({url: expectedURL, headers: {'Authorization': mockSecretKey}});
    });

    it('When calling getCount and the key is rejected, it should throw an error', async () => {
		const mockKey = 'mockKey';
		const mockRequestURL = 'http://mock.com';
		const expectedURL = `${mockRequestURL}/${mockKey}`;
		const mockSecretKey = 'mockSecretKey';
        const mockErrorResponse = 'Not authorized error mock';
		jest.spyOn(fetchModule, 'fetch').mockImplementation(() => {throw new Error(mockErrorResponse)});
        const sut = new Service({accountServiceURL: mockRequestURL, requestServiceKey: mockSecretKey, requestServiceURL: mockRequestURL});

        await expect(sut._getRequestCountForLastInterval(mockKey)).rejects.toThrowError(mockErrorResponse);
        expect(fetchModule.fetch).toHaveBeenCalledWith({url: expectedURL, headers: {'Authorization': mockSecretKey}});
    });

});
const Service = require('../src/service');
const Account = require('../src/model/account');

describe('Account Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When calling get, it should call the repository with the received key and return an account', async () => {
        const mockKey = 'mockKey';
        const mockAdminKey = 'mockKey';
        const mockResponse = {
            key: mockKey,
            name: 'mockname',
            isAdmin: false
        };

        const repositoryMock = {
            get: jest.fn().mockResolvedValue(new Account(mockResponse))
        };

        jest.spyOn(Service.prototype, 'authorizeAdmin').mockResolvedValue();

        const sut = new Service(repositoryMock);

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

        const sut = new Service(repositoryMock);

        await sut.create({key: mockKey, newAccount: mockNewAccount});

        expect(Service.prototype.authorizeAdmin).toHaveBeenCalledWith(mockKey);
        expect(repositoryMock.create).toHaveBeenCalledWith(mockNewAccount);
    });

    it('When calling authorize with an existing user, it should return', async () => {
        const mockKey = 'mockKey';
        const repositoryMock = {
            get: jest.fn().mockResolvedValue({})
        };

        const sut = new Service(repositoryMock);

        await expect(sut.authorize(mockKey)).resolves;
        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorize with a non-existing user, it should throw an error', async () => {
        const mockKey = 'mockKey';
        const repositoryMock = {
            get: jest.fn().mockRejectedValue()
        };

        const sut = new Service(repositoryMock);

        await expect(sut.authorize(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin with an existing admin user, it should return', async () => {
        const mockKey = 'mockKey';
        const repositoryMock = {
            get: jest.fn().mockResolvedValue({isAdmin: true})
        };

        const sut = new Service(repositoryMock);

        await expect(sut.authorizeAdmin(mockKey)).resolves;
        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin with a non-existing user, it should throw an error', async () => {
        const mockKey = 'mockKey';
        const repositoryMock = {
            get: jest.fn().mockRejectedValue()
        };

        const sut = new Service(repositoryMock);

        await expect(sut.authorizeAdmin(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
    });

    it('When calling authorizeAdmin with an existing not admin user, it should throw an error', async () => {
        const mockKey = 'mockKey';
        const repositoryMock = {
            get: jest.fn().mockResolvedValue({isAdmin: false})
        };

        const sut = new Service(repositoryMock);

        await expect(sut.authorizeAdmin(mockKey)).rejects.toThrowError('The account is not authorized to perform this operation');
        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
    });

    it('When calling delete, it should call authorizeAdmin and the repository', async () => {
        const mockAdminKey = 'mockAdminKey';
        const mockKey = 'mockKey';
        const repositoryMock = {
            delete: jest.fn().mockResolvedValue()
        };

        jest.spyOn(Service.prototype, 'authorizeAdmin').mockResolvedValue();        

        const sut  = new Service(repositoryMock);

        await expect(sut.delete({key: mockAdminKey, accountKey: mockKey})).resolves.toBeUndefined();
        expect(Service.prototype.authorizeAdmin).toHaveBeenCalledWith(mockAdminKey);
        expect(repositoryMock.delete).toHaveBeenCalledWith(mockKey);
    });

});
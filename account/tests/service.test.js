const Service = require('../src/service');
const Account = require('../src/model/account');

describe('Repository Service', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('When calling get, it should call the repository with the received key and return an account', async () => {
        const mockKey = 'mockKey';
        const mockResponse = {
            key: mockKey,
            name: 'mockname',
            isAdmin: false
        };

        const repositoryMock = {
            get: jest.fn().mockResolvedValue(mockResponse)
        };

        const sut = new Service(repositoryMock);

        const result = await sut.get(mockKey);

        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
        expect(result).toBeInstanceOf(Account);
        expect(result).toEqual(mockResponse);
    });

    it('When calling create, it should check the permissions of the key and create the account', () => {
        const mockKey = 'mockKey';
        const mockAccount = {
            key: mockKey,
            name: 'mockname',
            isAdmin: true
        };

        const mockNewAccount = {
            key: 'test',
            name: 'test',
            isAdmin: false
        };

        const repositoryMock = {
            get: jest.fn().mockResolvedValue(mockAccount),
            create: jest.fn().mockResolvedValue()
        };

        const sut = new Service(repositoryMock);

        await sut.create({key, mockNewAccount});

        expect(repositoryMock.get).toHaveBeenCalledWith(mockKey);
        expect(repositoryMock.create).toHaveBeenCalledWith(mockNewAccount);
    });

});
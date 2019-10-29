
const mariadb = require('mariadb');
const AccountRepository = require('../src/repository');
const Account = require('../src/model/account');
jest.mock('mariadb');

describe('Account Repository', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('When calling get without a key, it should throw an error', async () => {
        const sut = new AccountRepository({});

        const result = sut.get();

        expect(result).rejects.toThrowError('A key is required');
    });

    test('When calling get without a string, it should throw an error', async () => {
        const sut = new AccountRepository({});

        const result = sut.get(5);

        expect(result).rejects.toThrowError('A key is required');
    });


    test('When calling get with a key, it should return the account', async () => {
        const mockData = { key: 'mockKey', name: 'mockName', isAdmin: true };
        const mockAccount = new Account(mockData);

        mockMariaDb(() => Promise.resolve([mockData]));

        const sut = new AccountRepository({});

        const result = await sut.get(mockData.key);

        expect(result).toStrictEqual(mockAccount);
    });

    test('When calling get with a key that doesn\'t exist, it should throw an error', async () => {
        const key = 'mockKey';
        mockMariaDb(() => Promise.resolve([]));

        const sut = new AccountRepository({});

        const result = sut.get(key);

        expect(result).rejects.toThrowError(`The key ${key} does not exist in the database`);
    });

    test('When calling create without a parameter, it should throw an error', async () => {
        const sut = new AccountRepository({});

        const result = sut.create();

        expect(result).rejects.toThrowError('An account is required');
    });

    test('When calling create without an account, it should throw an error', async () => {
        const sut = new AccountRepository({});

        const result = sut.create(5);

        expect(result).rejects.toThrowError('An account is required');
    });

    test('When calling delete without a key, it should throw an error', async () => {
        const sut = new AccountRepository({});

        const result = sut.delete();

        expect(result).rejects.toThrowError('A key is required');
    });

    test('When calling create with an account, it should call mariadb to create it', async () => {
        const mockAccount = new Account({ key: "432423423", name: "Jock Shipperbottom" })

        const mockQueryInstance = mockMariaDb(() => Promise.resolve({ affectedRows: 1, insertId: 1, warningStatus: 0 }))

        const sut = new AccountRepository({});

        await sut.create(mockAccount);

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][0]).toEqual(expect.stringContaining(mockAccount.key));
    });

    test('When calling create with an account but the database doesn\'t return affected rows, it should throw an error', async () => {
        const mockAccount = new Account({ key: "432423423", name: "Jock Shipperbottom" })

        const mockQueryInstance = mockMariaDb(() => Promise.resolve())

        const sut = new AccountRepository({});

        expect(sut.create(mockAccount)).rejects.toThrowError('There was an error creating the new account');

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][0]).toEqual(expect.stringContaining(mockAccount.key));
    });

    test('When calling create with an account but the database doesn\'t return one affected row, it should throw an error', async () => {
        const mockAccount = new Account({ key: "432423423", name: "Jock Shipperbottom" })

        const mockQueryInstance = mockMariaDb(() => Promise.resolve({ affectedRows: 0, insertId: 1, warningStatus: 0 }))

        const sut = new AccountRepository({});

        expect(sut.create(mockAccount)).rejects.toThrowError('There was an error creating the new account');

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][0]).toEqual(expect.stringContaining(mockAccount.key));
    });

    test('When calling delete with an account but the database doesn\'t return affected rows, it should throw an error', async () => {
        const key = "432423423";

        const mockQueryInstance = mockMariaDb(() => Promise.resolve())

        const sut = new AccountRepository({});

        expect(sut.delete(key)).rejects.toThrowError('There was an error deleting the new account');

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][1]).toEqual(expect.arrayContaining([key]));
    });

    test('When calling delete with an account but the database doesn\'t return one affected row, it should throw an error', async () => {
        const key = "432423423";

        const mockQueryInstance = mockMariaDb(() => Promise.resolve({ affectedRows: 0, insertId: 1, warningStatus: 0 }))

        const sut = new AccountRepository({});

        expect(sut.delete(key)).rejects.toThrowError('There was an error deleting the new account');

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][1]).toEqual(expect.arrayContaining([key]));
    });
});

const mockMariaDb = queryImplementation => {
    const mockQueryInstance = jest.fn(queryImplementation);
    mariadb.createPool.mockImplementation(() => {
        return {
            query: mockQueryInstance,
            escape: value => value
        };
    });

    return mockQueryInstance;
};

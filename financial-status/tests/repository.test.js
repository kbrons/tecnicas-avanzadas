
const mariadb = require('mariadb');
const FinancialStatusRepository = require('../src/repository');
const FinancialStatus = require('../src/model/financialStatus');
jest.mock('mariadb');

describe('Financial Status Repository', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('When calling get with a CUIT, it should return its status', async () => {
        const mockStatus = new FinancialStatus({ status: 1, cuit: '29-23245438-8' });

        mockMariaDb(() => Promise.resolve([{
            status: mockStatus.status
        }]));

        const sut = new FinancialStatusRepository('', '', '');

        const result = await sut.get(mockStatus.cuit);

        expect(result).toStrictEqual(mockStatus);
    });

    test('When calling get with a CUIT that doesn\'t exist, it should throw an error', async () => {
        const cuit = '29-23245438-8';
        mockMariaDb(() => Promise.resolve([]));

        const sut = new FinancialStatusRepository('', '', '');

        const result = sut.get(cuit);

        expect(result).rejects.toThrowError(`The CUIT ${cuit} does not exist in the database`);
    });

    test('When calling get with an array of CUITs, it should return their statuses', async () => {
        const mockStatuses = [
            { status: 1, cuit: '29-23245438-8' },
            { status: 3, cuit: '27-27245345-8' },
            { status: 5, cuit: '23-23245438-8' },
            { status: 2, cuit: '33-23245438-8' }
        ];

        const expectedResult = mockStatuses.map(({ status, cuit }) => new FinancialStatus({ status, cuit }));

        mockMariaDb(() => Promise.resolve(mockStatuses));

        const sut = new FinancialStatusRepository('', '', '');

        const result = await sut.get(mockStatuses.map(({ cuit }) => cuit));

        expect(result).toStrictEqual(expectedResult);
    });

    test('When calling addOrUpdate without a parameter, it should throw an error', async () => {
        const sut = new FinancialStatusRepository('', '', '');

        const result = sut.addOrUpdate();

        expect(result).rejects.toThrowError(`The parameter is not valid`);
    });

    test('When calling addOrUpdate with a non-array parameter, it should throw an error', async () => {
        const sut = new FinancialStatusRepository('', '', '');

        const result = sut.addOrUpdate('test');

        expect(result).rejects.toThrowError(`The parameter is not valid`);
    });

    test('When calling addOrUpdate with an array of financial statuses, it should ', async () => {
        const mockFinancialStatuses = [
            new FinancialStatus({ status: 5, dni: "27170936", cuit: "30-27170936-9", name: "Jock Shipperbottom" }),
            new FinancialStatus({ status: 5, dni: "81704837", cuit: "33-81704837-7", name: "Cale Liveing" })
        ];

        const mockQueryInstance = mockMariaDb(() => Promise.resolve({ affectedRows: 2, insertId: 2, warningStatus: 0 }))

        const sut = new FinancialStatusRepository('', '', '');

        await sut.addOrUpdate(mockFinancialStatuses);

        expect(mockQueryInstance).toHaveBeenCalled();
        expect(mockQueryInstance.mock.calls[0][0]).toEqual(expect.stringContaining(mockFinancialStatuses[0].cuit));
        expect(mockQueryInstance.mock.calls[0][0]).toEqual(expect.stringContaining(mockFinancialStatuses[1].cuit));
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

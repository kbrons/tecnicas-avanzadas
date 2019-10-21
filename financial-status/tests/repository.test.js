
const mariadb = require('mariadb');
const FinancialStatusRepository = require('../src/repository');
const FinancialStatus = require('../src/model/financialStatus');
jest.mock('mariadb');

describe('Financial Status Repository', () => {
    test('When calling get with a CUIT, it should return its status', async () => {
        const mockStatus = new FinancialStatus({ status: 1, cuit: '29-23245438-8' });

        mariadb.createPool.mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => Promise.resolve([{
                    status: mockStatus.status
                }]))
            };
        });

        const sut = new FinancialStatusRepository('', '', '');

        const result = await sut.get(mockStatus.cuit);

        expect(result).toStrictEqual(mockStatus);
    });

    test('When calling get with a CUIT that doesn\'t exist, it should throw an error', async () => {
        const cuit = '29-23245438-8';
        mariadb.createPool.mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => Promise.resolve([]))
            };
        });

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

        const expectedResult = mockStatuses.map(({status, cuit}) => new FinancialStatus({ status, cuit }))

        mariadb.createPool.mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => Promise.resolve(mockStatuses))
            };
        });

        const sut = new FinancialStatusRepository('', '', '');

        const result = await sut.get(mockStatuses.map(({cuit}) => cuit));

        expect(result).toStrictEqual(expectedResult);
    });
});

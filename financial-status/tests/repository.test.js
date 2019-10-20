
const mariadb = require('mariadb');
const FinancialStatusRepository = require('../src/repository');
const FinancialStatus = require('../src/model/financialStatus');
jest.mock('mariadb');

describe('Financial Status Repository', () => {
    test('When calling get without an array or string, it should throw an error', async () => {
        const sut = new FinancialStatusRepository('', '', '');
        
        await expect(sut.get(5)).rejects.toThrow('The parameter must be a string ir array of strings');
    });

    test('When calling get without parameters, it should throw an error', async () => {
        const sut = new FinancialStatusRepository('', '', '');
        
        await expect(sut.get()).rejects.toThrow('A parameter is required');
    });

    test('When calling get with a CUIT, it should return its status', async () => {
        const mockStatus = new FinancialStatus({status: 1, cuit: '29-23245438-8'});

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
});

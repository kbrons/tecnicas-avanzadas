const fetchModule = require('node-fetch');
jest.mock('node-fetch', () => jest.fn());
const { fetch } = require('../src/fetchService');

describe('fetchService', () => {
	it('When calling fetch with a url, it should call fetch with it', async () => {
        const expectedURL = 'http://mock.com/';
        fetchModule.mockResolvedValue({ok: true, json: () => Promise.reject()});

        await expect(fetch({url: expectedURL})).resolves.toStrictEqual({});
        expect(fetchModule).toHaveBeenCalledWith(expectedURL, {method: 'GET', headers: {}});
	});
	
	it('When calling fetch with a url and a method, it should call fetch with them', async () => {
		const expectedURL = 'http://mock.com/';
		const expectedMethod = 'PUT';
        fetchModule.mockResolvedValue({ok: true, json: () => Promise.resolve({})});

        await expect(fetch({url: expectedURL, method: expectedMethod})).resolves.toStrictEqual({});
        expect(fetchModule).toHaveBeenCalledWith(expectedURL, {method: expectedMethod, headers: {}});
	});
	
	it('When calling fetch with a url and headers, it should call fetch with them', async () => {
		const expectedURL = 'http://mock.com/';
		const expectedHeaders = {'Authorization': 'mockAPIKey'};
        fetchModule.mockResolvedValue({ok: true, json: () => Promise.resolve({})});

        await expect(fetch({url: expectedURL, headers: expectedHeaders})).resolves.toStrictEqual({});
        expect(fetchModule).toHaveBeenCalledWith(expectedURL, {method: 'GET', headers: expectedHeaders});
	});
	
	it('When calling fetch and the response has ok as false, it should throw an error', async () => {
		const expectedURL = 'http://mock.com/';
		const expectedError = 'mock error';
        fetchModule.mockResolvedValue({ok: false, json: () => Promise.resolve({message: expectedError})});

        await expect(fetch({url: expectedURL})).rejects.toThrowError(expectedError);
        expect(fetchModule).toHaveBeenCalledWith(expectedURL, {method: 'GET', headers: {}});
	});

	it('When calling fetch, the response has ok as false and the body doesn\'t have a message, it should throw an error with the statusText', async () => {
		const expectedURL = 'http://mock.com/';
		const expectedError = 'mock error';
        fetchModule.mockResolvedValue({ok: false, json: () => Promise.reject(), statusText: expectedError});

        await expect(fetch({url: expectedURL})).rejects.toThrowError(expectedError);
        expect(fetchModule).toHaveBeenCalledWith(expectedURL, {method: 'GET', headers: {}});
	});
});
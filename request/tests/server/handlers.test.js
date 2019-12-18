const expressAsyncHandler = require('express-async-handler');
const { buildHandlers } = require('../../src/server/handlers');

jest.mock('express-async-handler', () => jest.fn((handler) => handler));

describe('Request Handlers', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('Should throw an error when no parameters are received', () => {
		expect(() => buildHandlers()).toThrowError();
	});

	it('Should throw an error when no controller is received', () => {
		expect(() => buildHandlers({})).toThrowError('The controller is required');
	});

	it('Should build the handlers when a controller is provided', () => {
		const controllerMock = {
			getCountForLastInterval: jest.fn(),
			recordRequest: jest.fn(),
		};

		const { getKey, putKey } = buildHandlers({controller: controllerMock});

		expect(getKey).toBeDefined();
		expect(putKey).toBeDefined();
		expect(expressAsyncHandler.mock.calls.length).toEqual(2);
	});

	it('Should call getCountForLastInterval when getKey is called', async () => {
		const controllerMock = {
			getCountForLastInterval: jest.fn().mockResolvedValue(0)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				key: mockKey
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		}

		const { getKey } = buildHandlers({controller: controllerMock});

		await getKey(requestMock, responseMock, () => {});

		expect(controllerMock.getCountForLastInterval).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalledWith(JSON.stringify(0));
	});

	it('Should call next with the error when getCountForLastInterval throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			getCountForLastInterval: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				key: mockKey
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { getKey } = buildHandlers({controller: controllerMock});

		await getKey(requestMock, responseMock, nextMock);

		expect(controllerMock.getCountForLastInterval).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call recordRequest when getKey is called', async () => {
		const controllerMock = {
			recordRequest: jest.fn().mockResolvedValue()
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				key: mockKey
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		}

		const { putKey } = buildHandlers({controller: controllerMock});

		await putKey(requestMock, responseMock, () => {});

		expect(controllerMock.recordRequest).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.end).toHaveBeenCalled();
	});

	it('Should call next with the error when recordRequest throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			recordRequest: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				key: mockKey
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { putKey } = buildHandlers({controller: controllerMock});

		await putKey(requestMock, responseMock, nextMock);

		expect(controllerMock.recordRequest).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});
});
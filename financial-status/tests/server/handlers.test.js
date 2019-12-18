const expressAsyncHandler = require('express-async-handler');
const { buildHandlers } = require('../../src/server/handlers');

jest.mock('express-async-handler', () => jest.fn((handler) => handler));

describe('Request Request Handlers', () => {
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

		const { getCuit, postAddOrUpdate, postCuits } = buildHandlers({controller: controllerMock});

		expect(getCuit).toBeDefined();
		expect(postCuits).toBeDefined();
		expect(postAddOrUpdate).toBeDefined();
		expect(expressAsyncHandler.mock.calls.length).toEqual(3);
	});

	it('Should call get when getCuit is called', async () => {
		const mockKey = 'mockKey';
		const mockCuit = '27-81503014-7';
		const mockStatus = {
			cuit: mockCuit,
			status: 5
		}
		const controllerMock = {
			get: jest.fn().mockResolvedValue(mockStatus)
		};
		
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				cuit: mockCuit
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		}

		const { getCuit } = buildHandlers({controller: controllerMock});

		await getCuit(requestMock, responseMock, () => {});

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey, parameters: mockCuit});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalledWith(mockStatus);
	});

	it('Should call next with the error when get throws', async () => {
		const errorMock = 'Error mock';
		const mockCuit = '27-81503014-7';
		const mockKey = 'mockKey';
		const controllerMock = {
			get: jest.fn().mockRejectedValue(errorMock)
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			params: {
				cuit: mockCuit
			}
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { getCuit } = buildHandlers({controller: controllerMock});

		await getCuit(requestMock, responseMock, nextMock);

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey, parameters: mockCuit});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call get when postCuits is called', async () => {
		const mockKey = 'mockKey';
		const mockCuit = '27-81503014-7';
		const mockStatus = {
			cuit: mockCuit,
			status: 5
		};
		const expectedResponse = [
			mockStatus
		];
		const controllerMock = {
			get: jest.fn().mockResolvedValue([mockStatus])
		};
		
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: [mockCuit]
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		}

		const { postCuits } = buildHandlers({controller: controllerMock});

		await postCuits(requestMock, responseMock, () => {});

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalledWith(expectedResponse);
	});

	it('Should call next with the error when get throws', async () => {
		const errorMock = 'Error mock';
		const mockCuit = '27-81503014-7';
		const mockKey = 'mockKey';
		const controllerMock = {
			get: jest.fn().mockRejectedValue(errorMock)
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: [mockCuit]
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { postCuits } = buildHandlers({controller: controllerMock});

		await postCuits(requestMock, responseMock, nextMock);

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call addOrUpdate when postAddOrUpdate is called', async () => {
		const mockKey = 'mockKey';
		const mockCuit = '27-81503014-7';
		const mockStatus = {
			cuit: mockCuit,
			status: 5
		};
		const controllerMock = {
			addOrUpdate: jest.fn().mockResolvedValue()
		};
		
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: [mockStatus]
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		}

		const { postAddOrUpdate } = buildHandlers({controller: controllerMock});

		await postAddOrUpdate(requestMock, responseMock, () => {});

		expect(controllerMock.addOrUpdate).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(responseMock.status).toHaveBeenCalledWith(204);
		expect(responseMock.end).toHaveBeenCalled();
	});

	it('Should call next with the error when addOrUpdate throws', async () => {
		const errorMock = 'Error mock';
		const mockCuit = '27-81503014-7';
		const mockStatus = {
			cuit: mockCuit,
			status: 5
		};
		const mockKey = 'mockKey';
		const controllerMock = {
			addOrUpdate: jest.fn().mockRejectedValue(errorMock)
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: [mockStatus]
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { postAddOrUpdate } = buildHandlers({controller: controllerMock});

		await postAddOrUpdate(requestMock, responseMock, nextMock);

		expect(controllerMock.addOrUpdate).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.end).not.toHaveBeenCalled();
	});
});
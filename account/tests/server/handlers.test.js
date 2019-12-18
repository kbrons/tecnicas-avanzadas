const expressAsyncHandler = require('express-async-handler');
const { buildHandlers } = require('../../src/server/handlers');

jest.mock('express-async-handler', () => jest.fn((handler) => handler));

describe('Account Request Handlers', () => {
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
		const controllerMock = {};

		const { getKey, deleteKey, authorize, authorizeAdmin, postAccount, putAccount } = buildHandlers({controller: controllerMock});

		expect(getKey).toBeDefined();
		expect(deleteKey).toBeDefined();
		expect(authorize).toBeDefined();
		expect(postAccount).toBeDefined();
		expect(putAccount).toBeDefined();
		expect(authorizeAdmin).toBeDefined();
		expect(expressAsyncHandler.mock.calls.length).toEqual(6);
	});

	it('Should call authorize when authorize is called', async () => {
		const controllerMock = {
			authorize: jest.fn().mockResolvedValue()
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey)
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		}

		const { authorize } = buildHandlers({controller: controllerMock});

		await authorize(requestMock, responseMock, () => {});

		expect(controllerMock.authorize).toHaveBeenCalledWith({key: mockKey});
		expect(responseMock.status).toHaveBeenCalledWith(204);
		expect(responseMock.end).toHaveBeenCalled();
	});

	it('Should call next with the error when authorize throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			authorize: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { authorize } = buildHandlers({controller: controllerMock});

		await authorize(requestMock, responseMock, nextMock);

		expect(controllerMock.authorize).toHaveBeenCalledWith({key: mockKey});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.end).not.toHaveBeenCalled();
	});

	it('Should call authorizeAdmin when authorizeAdmin is called', async () => {
		const controllerMock = {
			authorizeAdmin: jest.fn().mockResolvedValue()
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey)
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		}

		const { authorizeAdmin } = buildHandlers({controller: controllerMock});

		await authorizeAdmin(requestMock, responseMock, () => {});

		expect(controllerMock.authorizeAdmin).toHaveBeenCalledWith({key: mockKey});
		expect(responseMock.status).toHaveBeenCalledWith(204);
		expect(responseMock.end).toHaveBeenCalled();
	});

	it('Should call next with the error when authorizeAdmin throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			authorizeAdmin: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			end: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { authorizeAdmin } = buildHandlers({controller: controllerMock});

		await authorizeAdmin(requestMock, responseMock, nextMock);

		expect(controllerMock.authorizeAdmin).toHaveBeenCalledWith({key: mockKey});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.end).not.toHaveBeenCalled();
	});

	it('Should call get when getKey is called', async () => {
		const mockKey = 'mockKey';
		const mockAccount = {
			name: 'test',
			isAdmin: false,
			requestLimit: 5,
			key: mockKey
		};
		const controllerMock = {
			get: jest.fn().mockResolvedValue(mockAccount)
		};
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

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalledWith(mockAccount);
	});

	it('Should call next with the error when get throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			get: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { getKey } = buildHandlers({controller: controllerMock});

		await getKey(requestMock, responseMock, nextMock);

		expect(controllerMock.get).toHaveBeenCalledWith({key: mockKey});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call delete when deleteKey is called', async () => {
		const mockKey = 'mockKey';
		const controllerMock = {
			delete: jest.fn().mockResolvedValue()
		};
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

		const { deleteKey } = buildHandlers({controller: controllerMock});

		await deleteKey(requestMock, responseMock, () => {});

		expect(controllerMock.delete).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.params});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalled();
	});

	it('Should call next with the error when delete throws', async () => {
		const errorMock = 'Error mock';
		const controllerMock = {
			delete: jest.fn().mockRejectedValue(errorMock)
		};
		const mockKey = 'mockKey';
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { deleteKey } = buildHandlers({controller: controllerMock});

		await deleteKey(requestMock, responseMock, nextMock);

		expect(controllerMock.delete).toHaveBeenCalledWith({key: mockKey});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call create when putAccount is called', async () => {
		const mockKey = 'mockKey';
		const mockAccount = {
			name: 'test',
			isAdmin: false,
			requestLimit: 5,
			key: mockKey
		};
		const controllerMock = {
			create: jest.fn().mockResolvedValue()
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: mockAccount
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		}

		const { putAccount } = buildHandlers({controller: controllerMock});

		await putAccount(requestMock, responseMock, () => {});

		expect(controllerMock.create).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalled();
	});

	it('Should call next with the error when create throws', async () => {
		const errorMock = 'Error mock';
		const mockKey = 'mockKey';
		const mockAccount = {
			name: 'test',
			isAdmin: false,
			requestLimit: 5,
			key: mockKey
		};
		const controllerMock = {
			create: jest.fn().mockRejectedValue(errorMock)
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: mockAccount
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { putAccount } = buildHandlers({controller: controllerMock});

		await putAccount(requestMock, responseMock, nextMock);

		expect(controllerMock.create).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});

	it('Should call update when postAccount is called', async () => {
		const mockKey = 'mockKey';
		const mockAccount = {
			name: 'test',
			isAdmin: false,
			requestLimit: 5,
			key: mockKey
		};
		const controllerMock = {
			update: jest.fn().mockResolvedValue()
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: mockAccount
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		}

		const { postAccount } = buildHandlers({controller: controllerMock});

		await postAccount(requestMock, responseMock, () => {});

		expect(controllerMock.update).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(responseMock.status).toHaveBeenCalledWith(200);
		expect(responseMock.send).toHaveBeenCalled();
	});

	it('Should call next with the error when update throws', async () => {
		const errorMock = 'Error mock';
		const mockKey = 'mockKey';
		const mockAccount = {
			name: 'test',
			isAdmin: false,
			requestLimit: 5,
			key: mockKey
		};
		const controllerMock = {
			update: jest.fn().mockRejectedValue(errorMock)
		};
		const requestMock = {
			header: jest.fn().mockReturnValue(mockKey),
			body: mockAccount
		};
		const responseMock = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis()
		};
		const nextMock = jest.fn();

		const { postAccount } = buildHandlers({controller: controllerMock});

		await postAccount(requestMock, responseMock, nextMock);

		expect(controllerMock.update).toHaveBeenCalledWith({key: mockKey, parameters: requestMock.body});
		expect(nextMock).toHaveBeenCalledWith(errorMock);
		expect(responseMock.status).not.toHaveBeenCalled();
		expect(responseMock.send).not.toHaveBeenCalled();
	});
});
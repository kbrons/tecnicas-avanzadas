const Service = require('../src/service');
const Request = require('../src/model/request');

describe('Request Service', () => {
	it('Should call the repository with the key and the predefined interval', async () => {
		const mockKey = 'mockKey';
		const mockInterval = 5;
		const mockCount = 3;
		const repositoryMock = {
			getCountForLastInterval: jest.fn().mockResolvedValue(mockCount)
		};

		const sut = new Service({interval: mockInterval, repository: repositoryMock});

		await expect(sut.getCountForLastInterval(mockKey)).resolves.toStrictEqual(mockCount);
		expect(repositoryMock.getCountForLastInterval).toHaveBeenCalledWith({key: mockKey, intervalOffset: mockInterval});
	});

	it('Should pass through the error when getCount fails', async () => {
		const mockKey = 'mockKey';
		const mockInterval = 5;
		const mockError = 'mock error';
		const repositoryMock = {
			getCountForLastInterval: jest.fn().mockRejectedValue(new Error(mockError))
		};

		const sut = new Service({interval: mockInterval, repository: repositoryMock});

		await expect(sut.getCountForLastInterval(mockKey)).rejects.toThrowError(mockError);
		expect(repositoryMock.getCountForLastInterval).toHaveBeenCalledWith({key: mockKey, intervalOffset: mockInterval});
	});

	it('Should call the repository with the request', async () => {
		const mockTime = Date.now();
		jest.spyOn(global.Date, 'now').mockReturnValueOnce(mockTime);
		const mockKey = 'mockKey';
		const mockInterval = 5;
		const repositoryMock = {
			create: jest.fn().mockResolvedValue()
		};

		const sut = new Service({interval: mockInterval, repository: repositoryMock});

		await expect(sut.recordRequest(mockKey)).resolves.toBeUndefined();
		expect(repositoryMock.create).toHaveBeenCalledWith({key: mockKey, time: mockTime});
		expect(repositoryMock.create).toHaveBeenCalledWith(expect.any(Request));
	});

	it('Should pass through the error when create fails', async () => {
		const mockKey = 'mockKey';
		const mockInterval = 5;
		const mockError = 'mock error';
		const repositoryMock = {
			create: jest.fn().mockRejectedValue(new Error(mockError))
		};

		const sut = new Service({interval: mockInterval, repository: repositoryMock});

		await expect(sut.recordRequest(mockKey)).rejects.toThrowError(mockError);
	});

	it('Should throw an error when no key is received to create', async () => {
		const mockInterval = 5;
		const repositoryMock = {
			create: jest.fn().mockResolvedValue()
		};

		const sut = new Service({interval: mockInterval, repository: repositoryMock});

		expect(() => sut.recordRequest()).toThrowError('The key is required');
	});
});

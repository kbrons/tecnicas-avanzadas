const Controller = require('../src/controller');

describe('Request Controller', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('Should throw an error when no authorization key is received', () => {
		const sut = new Controller({secretKey: 'mockSecretKey'});

		expect(() => sut._authorizeKey()).toThrowError('Unauthorized');
	});

	it('Should throw an error when the authorization key doesn\'t match', () => {
		const sut = new Controller({secretKey: 'mockSecretKey'});

		expect(() => sut._authorizeKey('differentMockSecretKey')).toThrowError('Unauthorized');
	});

	it('Should return when the authorization key matches', () => {
		const mockSecretKey = 'mockSecretKey';
		const sut = new Controller({secretKey: mockSecretKey});

		expect(sut._authorizeKey(mockSecretKey)).toBeUndefined();
	});

	it('Should throw an error when no key is received', () => {
		const sut = new Controller({secretKey: 'mockSecretKey'});

		expect(() => sut._validateParameters({})).toThrowError('The key is required');
	});

	it('Should return when the key is not null or undefined', () => {
		const mockKey = 'mockKey';
		const sut = new Controller({secretKey: 'mockSecretKey'});

		expect(sut._validateParameters({key: mockKey})).toBeUndefined();
	});

	it('Should call the service getCount after validating', async () => {
		const mockSecretKey = 'mockSecretKey';
		const mockKey = 'mockKey';
		const mockCount = 5;
		const mockService = {
			getCountForLastInterval: jest.fn().mockResolvedValue(mockCount)
		}
		
		jest.spyOn(Controller.prototype, '_authorizeKey').mockReturnValue();
		jest.spyOn(Controller.prototype, '_validateParameters').mockReturnValue();
		
		const sut = new Controller({secretKey: mockSecretKey, service: mockService});

		await expect(sut.getCountForLastInterval({key: mockSecretKey, parameters: {key: mockKey}})).resolves.toStrictEqual(mockCount);
		expect(Controller.prototype._authorizeKey).toHaveBeenCalledWith(mockSecretKey);
		expect(Controller.prototype._validateParameters).toHaveBeenCalledWith({key: mockKey});
	});

	it('Should call the service recordRequest after validating', async () => {
		const mockSecretKey = 'mockSecretKey';
		const mockKey = 'mockKey';
		const mockService = {
			recordRequest: jest.fn().mockResolvedValue()
		}
		
		jest.spyOn(Controller.prototype, '_authorizeKey').mockReturnValue();
		jest.spyOn(Controller.prototype, '_validateParameters').mockReturnValue();
		
		const sut = new Controller({secretKey: mockSecretKey, service: mockService});

		await expect(sut.recordRequest({key: mockSecretKey, parameters: {key: mockKey}})).resolves.toBeUndefined();
		expect(Controller.prototype._authorizeKey).toHaveBeenCalledWith(mockSecretKey);
		expect(Controller.prototype._validateParameters).toHaveBeenCalledWith({key: mockKey});
	});
});
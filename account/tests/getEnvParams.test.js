describe('getEnvParams', () => {
	beforeEach(() => {
		jest.resetModules();
		process.env = {};
	});

	it('Should return env params when all are present', () => {
		const mockValue = 'mock value';
		process.env.DB_HOST = mockValue;
		process.env.DB_PORT = mockValue;
		process.env.DB_USERNAME = mockValue;
		process.env.DB_PASSWORD = mockValue;
		process.env.DB_NAME = mockValue;
		process.env.REQUEST_URL = mockValue;
		process.env.REQUEST_KEY = mockValue;

		const expectedEnvParams = {
			host: mockValue,
			port: mockValue,
			user: mockValue,
			password: mockValue,
			database: mockValue,
			requestServiceURL: mockValue,
			requestServiceKey: mockValue
		};

		const { getEnvParams } = require('../src/getEnvParams');

		const envParams = getEnvParams();

		expect(envParams).toStrictEqual(expectedEnvParams);
	});

	it('Should throw an error when none are present', () => {
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'host, port, user, password, database, requestServiceURL, requestServiceKey';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});

	it('Should throw an error when some aren\'t present', () => {
		const mockValue = 'mock value';
		process.env.DB_PASSWORD = mockValue;
		process.env.DB_NAME = mockValue;
		process.env.REQUEST_URL = mockValue;
		process.env.REQUEST_KEY = mockValue;
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'host, port, user';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});
});

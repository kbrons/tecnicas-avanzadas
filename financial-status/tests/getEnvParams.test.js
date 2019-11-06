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
		process.env.ACCOUNT_SERVICE_URL = mockValue;

		const expectedEnvParams = {
			host: mockValue,
			port: mockValue,
			user: mockValue,
			password: mockValue,
			database: mockValue,
			accountServiceURL: mockValue,
		};

		const { getEnvParams } = require('../src/getEnvParams');

		const envParams = getEnvParams();

		expect(envParams).toStrictEqual(expectedEnvParams);
	});

	it('Should throw an error when none are present', () => {
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'host, port, user, password, database, accountServiceURL';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});

	it('Should throw an error when some aren\'t present', () => {
		const mockValue = 'mock value';
		process.env.DB_PASSWORD = mockValue;
		process.env.DB_NAME = mockValue;
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'host, port, user, accountServiceURL';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});
});

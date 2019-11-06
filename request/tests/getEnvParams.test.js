describe('getEnvParams', () => {
	beforeEach(() => {
		jest.resetModules();
		process.env = {};
	});

	it('Should return env params when all are present', () => {
		const mockValue = 'mock value';
		process.env.DB_HOST = mockValue;
		process.env.DB_PORT = mockValue;
		process.env.INTERVAL = mockValue;
		process.env.SECRET_KEY = mockValue;

		const expectedEnvParams = {
			host: mockValue,
			port: mockValue,
			interval: mockValue,
			secretKey: mockValue
		};

		const { getEnvParams } = require('../src/getEnvParams');

		const envParams = getEnvParams();

		expect(envParams).toStrictEqual(expectedEnvParams);
	});

	it('Should throw an error when none are present', () => {
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'host, port, interval, secretKey';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});

	it('Should throw an error when some aren\'t present', () => {
		const mockValue = 'mock value';
		process.env.DB_HOST = mockValue;
		process.env.DB_PORT = mockValue;
		
		const { getEnvParams } = require('../src/getEnvParams');

		const expectedError = 'One or more required environment variables were not found. Please review your configuration for '
		+ 'interval, secretKey';
		expect(() => getEnvParams()).toThrowError(expectedError);
	});
});

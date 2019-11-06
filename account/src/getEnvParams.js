function getEnvParams() {
	const envParams = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		requestServiceURL: process.env.REQUEST_URL,
		requestServiceKey: process.env.REQUEST_KEY
	};

	const notPresentEnvParams = Object.keys(envParams).filter(envParameter => !envParams[envParameter]).join(', ');

	if (notPresentEnvParams) {
		throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentEnvParams}`);
	}

	return envParams;
}

module.exports = { getEnvParams };
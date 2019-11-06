function getEnvParams() {
	const envParams = {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		interval: process.env.INTERVAL,
		secretKey: process.env.SECRET_KEY
	};

	const notPresentEnvParams = Object.keys(envParams).filter(envParameter => !envParams[envParameter]).join(', ');

	if (notPresentEnvParams) {
		throw new Error(`One or more required environment variables were not found. Please review your configuration for ${notPresentEnvParams}`);
	}

	return envParams;
}

module.exports = { getEnvParams };
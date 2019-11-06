const nodeFetch = require('node-fetch');

const fetch = async ({ url, method = 'GET', headers = {} }) => {
	const result = await nodeFetch(url, { method, headers }).then(async response => ({
		ok: response.ok,
		body: await response.json().catch(() => ({})),
		statusText: response.statusText
	}));

	console.log(`${url} call result: ${JSON.stringify(result)}`);

	if (!result.ok) {
		throw new Error(result.body.message || result.statusText);
	}

	return result.body;
};

module.exports = { fetch };

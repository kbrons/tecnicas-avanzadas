const asyncHandler = require('express-async-handler');

const buildHandlers = ({controller}) => {
	if (!controller) {
		throw new Error('The controller is required');
	}

	const getCuit = asyncHandler(async (request, response, next) => {
		try {
			const result = await controller.get({key: request.header("Authorization"), parameters: request.params['cuit']});
			response.status(200).send(result);
		} catch (error) {
			next(error);
		}
	});

	const postCuits = asyncHandler(async (request, response, next) => {
		try {
			const result = await controller.get({key: request.header("Authorization"), parameters: request.body});
			response.status(200).send(result);
		} catch (error) {
			next(error);
		}
	});

	const postAddOrUpdate = asyncHandler(async (request, response, next) => {
		try {
			await controller.addOrUpdate({key: request.header("Authorization"), parameters: request.body});
			response.status(204).end();
		} catch (error) {
			next(error);
		}
	});

	return {
		getCuit,
		postCuits,
		postAddOrUpdate
	}
}

module.exports = {
	buildHandlers
};

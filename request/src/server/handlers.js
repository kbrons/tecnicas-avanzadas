const asyncHandler = require('express-async-handler');

const buildHandlers = (controller) => {
	const getKey = asyncHandler(async (request, response, next) => {
		try {
			const result = await controller.getCountForLastInterval({key: request.header('Authorization'), parameters: request.params});
			response.status(200).send(JSON.stringify(result));
		} catch (error) {
			next(error);
		}
	});
	
	const putKey = asyncHandler(async (request, response, next) => {
		try {
			await controller.recordRequest({key: request.header('Authorization'), parameters: request.params});
			response.status(200).end();
		} catch (error) {
			next(error);
		}
	});

	return {
		getKey,
		putKey
	};
}



module.exports = {
	buildHandlers
};

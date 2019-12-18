const asyncHandler = require('express-async-handler');

const buildHandlers = ({controller}) => {
	if (!controller) {
		throw new Error('The controller is required');
	}

	const getKey = asyncHandler(async (request, response, next) => {
		try {
			response.status(200).send(await controller.get({key: request.header('Authorization'), parameters: request.params}));
		} catch (error) {
			next(error);
		}
	});

	const deleteKey = asyncHandler(async (request, response, next) => {
		try {
			response.status(200).send(await controller.delete({key: request.header('Authorization'), parameters: request.params}));
		} catch (error) {
			next(error);
		}
	});

	const putAccount = asyncHandler(async (request, response, next) => {
		try {
			response.status(200).send(await controller.create({key: request.header('Authorization'), parameters: request.body}));
		} catch (error) {
			next(error);
		}
	});

	const postAccount = asyncHandler(async (request, response, next) => {
		try {
			response.status(200).send(await controller.update({key: request.header('Authorization'), parameters: request.body}));
		} catch (error) {
			next(error);
		}
	});

	const authorize = asyncHandler(async (request, response, next) => {
		try {
			await controller.authorize({key: request.header('Authorization')});
			response.status(204).end();
		} catch (error) {
			next(error);
		}
	});

	const authorizeAdmin = asyncHandler(async (request, response, next) => {
		try {
			await controller.authorizeAdmin({key: request.header('Authorization')});
			response.status(204).end();
		} catch (error) {
			next(error);
		}
	});

	return {
		getKey,
		deleteKey,
		putAccount,
		postAccount,
		authorize,
		authorizeAdmin
	};
};

module.exports = {
	buildHandlers
};

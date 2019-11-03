module.exports = request => ({
    key: request.header('Authorization'),
    parameters: {
        ...request.params,
        ...request.body
    }
});
const Redis = require('ioredis');

module.exports = class RequestRepository {
    constructor({port, host, password, db}) {
        this._redis = new Redis({port, host, password, db, lazyConnect: true});
    }

    async create(request) {
        try {
            await this._redis.zadd(request.key, request.time, request.time);
        }
        catch (error) {
            console.error(error);
            throw new Error('There was an error creating the request log');
        }
    }

    async getCountForLastInterval({key, intervalOffset}) {
        const now = Date.now();
        try {
            return await this._redis.zcount(key, now - intervalOffset, now);
        }
        catch (error) {
            console.error(error);
            throw new Error(`There was an error getting the request count for ${key} in ${intervalOffset}`);
        }
    }
}
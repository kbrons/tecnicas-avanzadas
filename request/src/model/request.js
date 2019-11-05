module.exports = class Request {
    constructor({key, time = Date.now()}) {
        this.key = key;
        this.time = time;
    }
}
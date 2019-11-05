const ioredis = require('ioredis');
jest.mock('ioredis');
const Repository = require('../src/repository');

describe('Request Repository', () => {
    it('Should call zadd when creating a request', async () => {
        const mockKey = 'mockKey';
        const mockTime = Date.now();
        const zaddMock = jest.fn().mockResolvedValue();
        
        ioredis.mockImplementation(() => ({
            zadd: zaddMock
        }));

        const sut = new Repository({});

        await expect(sut.create({
            key: mockKey,
            time: mockTime
        })).resolves.toBeUndefined();
        expect(zaddMock).toHaveBeenCalledWith(mockKey, mockTime, mockTime);
    });

    it('Should throw an error when creating a request fails', async () => {
        const mockKey = 'mockKey';
        const mockTime = Date.now();
        const zaddMock = jest.fn().mockRejectedValue();
        
        ioredis.mockImplementation(() => ({
            zadd: zaddMock
        }));

        const sut = new Repository({});

        await expect(sut.create({
            key: mockKey,
            time: mockTime
        })).rejects.toThrowError('There was an error creating the request log');
        expect(zaddMock).toHaveBeenCalledWith(mockKey, mockTime, mockTime);
    });

    it('Should return the count of requests in interval when calling getCountForLastInterval', async () => {
        const mockKey = 'mockKey';
        const mockInterval = 1;
        const mockTime = Date.now();
        jest.spyOn(global.Date, 'now').mockReturnValueOnce(mockTime);
        const mockCount = 5;
        const zcountMock = jest.fn().mockResolvedValue(mockCount);
        
        ioredis.mockImplementation(() => ({
            zcount: zcountMock
        }));

        const sut = new Repository({});

        await expect(sut.getCountForLastInterval({
            key: mockKey, 
            intervalOffset: mockInterval
        })).resolves.toStrictEqual(mockCount);
        expect(zcountMock).toHaveBeenCalledWith(mockKey, mockTime - mockInterval, mockTime);
    });

    it('Should throw an error when getting the request count fails', async () => {
        const mockKey = 'mockKey';
        const mockInterval = 1;
        const mockTime = Date.now();
        jest.spyOn(global.Date, 'now').mockReturnValueOnce(mockTime);
        const zcountMock = jest.fn().mockRejectedValue();
        
        ioredis.mockImplementation(() => ({
            zcount: zcountMock
        }));

        const sut = new Repository({});

        await expect(sut.getCountForLastInterval({
            key: mockKey, 
            intervalOffset: mockInterval
        })).rejects.toThrowError(`There was an error getting the request count for ${mockKey} in ${mockInterval}`);
        expect(zcountMock).toHaveBeenCalledWith(mockKey, mockTime - mockInterval, mockTime);
    });
});

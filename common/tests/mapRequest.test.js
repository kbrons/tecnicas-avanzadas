const mapRequest = require('../src/mapRequest');

describe('Map Request', () => {
    it('Should get the key from the header and return it', () => {
        const mockKey = 'mockKey';
        const requestMock = {
            header: jest.fn().mockReturnValue(mockKey),
            params: {},
            body: {}
        };

        const result = mapRequest(requestMock);

        expect(requestMock.header).toHaveBeenCalledWith('Authorization');
        expect(result.key).toStrictEqual(mockKey);
    });

    it('Should get the params and return them', () => {
        const mockKey = 'mockKey';
        const mockParams = { cuit: '12345' };
        const requestMock = {
            header: jest.fn().mockReturnValue(mockKey),
            params: mockParams,
            body: {}
        };

        const result = mapRequest(requestMock);

        expect(result.parameters).toStrictEqual(mockParams);
    });

    it('Should get the body and return it', () => {
        const mockKey = 'mockKey';
        const mockBody = { cuit: '12345', test: 'test' };
        const requestMock = {
            header: jest.fn().mockReturnValue(mockKey),
            params: {},
            body: mockBody
        };

        const result = mapRequest(requestMock);

        expect(result.parameters).toStrictEqual(mockBody);
    });

    it('Should get the body and params, and return them', () => {
        const mockKey = 'mockKey';
        const mockParams = { cuit: '12345' };
        const mockBody = { test: 'test' };
        const requestMock = {
            header: jest.fn().mockReturnValue(mockKey),
            params: mockParams,
            body: mockBody
        };

        const result = mapRequest(requestMock);

        expect(result.parameters).toMatchObject(mockBody);
        expect(result.parameters).toMatchObject(mockParams);
    });
});
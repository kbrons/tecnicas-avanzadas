const utils = require('../src/utils');

describe('utils test - isString', () => {
    test('Should return true when the parameter is a string', () => {
        expect(utils.isString('test')).toBe(true);
    });

    test('Should return false when the parameter is not a string', () => {
        expect(utils.isString(5)).toBe(false);
    });
});

describe('utils test - isStringArray', () => {
    test('Should return true when the parameter is an array of strings', () => {
        expect(utils.isStringArray(['test', 'test2', 'test3'])).toBe(true);
    });

    test('Should return false when the parameter is not an array of strings', () => {
        expect(utils.isStringArray([5, 6, 2])).toBe(false);
    });

    test('Should return false when the parameter is not an array', () => {
        expect(utils.isStringArray(4)).toBe(false);
    });
});

describe('utils test - isMethod', () => {
    test('Should return true when the parameter is a function', () => {
        expect(utils.isFunction(() => {})).toBe(true);
    });

    test('Should return false when the parameter is not a function', () => {
        expect(utils.isFunction('')).toBe(false);
    });
});

describe('utils test - isMethod', () => {
    test('Should return true when the parameter is a function', () => {
        expect(utils.isFunction(() => {})).toBe(true);
    });

    test('Should return false when the parameter is not a function', () => {
        expect(utils.isFunction('')).toBe(false);
    });
});

describe('utils test - isStringOrStringArray', () => {
    test('Should call isString and isArray', () => {
        jest.spyOn(utils, 'isString').mockImplementation(() => false);
        jest.spyOn(utils, 'isStringArray').mockImplementation(() => false);

        const testValue = 5;

        utils.isStringOrStringArray(testValue);

        expect(utils.isString).toHaveBeenCalledWith(testValue);
        expect(utils.isStringArray).toHaveBeenCalledWith(testValue);
        jest.restoreAllMocks();
    });
});

describe('utils test - callForStringOrArray', () => {
    test('Should throw an error if stringCallback is not a function', () => {
        const testStringCallback = 5;
        jest.spyOn(utils, 'isFunction').mockImplementation((value) => value !== testStringCallback);

        expect(() => utils.callForStringOrArray({stringCallback: testStringCallback, argument: 'test'})).toThrowError('The callbacks must be functions');
        expect(utils.isFunction).toHaveBeenCalledWith(testStringCallback);
        jest.restoreAllMocks();
    });

    test('Should throw an error if arrayCallback is not a function', () => {
        const testArrayCallback = 5;
        jest.spyOn(utils, 'isFunction').mockImplementation((value) => value !== testArrayCallback);

        expect(() => utils.callForStringOrArray({arrayCallback: testArrayCallback, argument: 'test'})).toThrowError('The callbacks must be functions');
        expect(utils.isFunction).toHaveBeenCalledWith(testArrayCallback);
        jest.restoreAllMocks();
    });

    test('Should throw an error if the argument is not of the expected types', () => {
        const testArgument = 5;
        jest.spyOn(utils, 'isString').mockImplementation(() => false);
        jest.spyOn(utils, 'isFunction').mockImplementation(() => true);

        expect(() => utils.callForStringOrArray({argument: testArgument})).toThrowError('The argument type is not valid');
        expect(utils.isString).toHaveBeenCalledWith(testArgument);
        jest.restoreAllMocks();
    });

    test('Should call stringCallback if the argument is a string', () => {
        const testArgument = 'test';
        jest.spyOn(utils, 'isString').mockImplementation(() => true);
        jest.spyOn(utils, 'isFunction').mockImplementation(() => true);
        const stringCallbackMock = jest.fn();

        expect(utils.callForStringOrArray({argument: testArgument, stringCallback: stringCallbackMock})).toBeUndefined();
        expect(stringCallbackMock).toHaveBeenCalledWith(testArgument);
        jest.restoreAllMocks();
    });

    test('Should call arrayCallback if the argument is a string array', () => {
        const testArgument = [''];
        jest.spyOn(utils, 'isString').mockImplementation(() => false);
        jest.spyOn(utils, 'isStringArray').mockImplementation(() => true);
        jest.spyOn(utils, 'isFunction').mockImplementation(() => true);
        const arrayCallbackMock = jest.fn();

        expect(utils.callForStringOrArray({argument: testArgument, arrayCallback: arrayCallbackMock})).toBeUndefined();
        expect(arrayCallbackMock).toHaveBeenCalledWith(testArgument);
        jest.restoreAllMocks();
    });

    test('Should throw an error if the argument doesn\'t have a value', async () => {
        expect(() => utils.callForStringOrArray({})).toThrowError('A parameter is required');
    });

    test('Should throw an error if it doesn\'t receive any arguments', async () => {
        expect(() => utils.callForStringOrArray()).toThrowError("Cannot destructure property `argument` of 'undefined' or 'null'.");
    });
});
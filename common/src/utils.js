function isString(argument) {
    return (typeof argument === 'string');
}

function isFunction(argument) {
    return (typeof argument === 'function');
}

function isStringArray(argument) {
    return Array.isArray(argument) && argument.every(element => exportedMethods.isString(element));
}

function isStringOrStringArray(argument) {
    return exportedMethods.isString(argument) || exportedMethods.isStringArray(argument);
}

function callForStringOrArray({argument, stringCallback, arrayCallback}) {
    if(!argument) {
        throw new Error('A parameter is required');
    }
    
    if(!exportedMethods.isFunction(stringCallback) || !exportedMethods.isFunction(arrayCallback)) {
        throw new Error('The callbacks must be functions');
    }

    if(!exportedMethods.isStringOrStringArray(argument)) {
        throw new Error('The argument type is not valid');
    }

    return exportedMethods.isString(argument) ? stringCallback(argument) : arrayCallback(argument);
}

const exportedMethods = {
    isString,
    isFunction,
    isStringArray,
    isStringOrStringArray,
    callForStringOrArray
};

module.exports = exportedMethods;

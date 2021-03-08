function isString(value) {
    return typeof value === 'string';
}

function isNumber(value) {
    return typeof value === 'number';
}

function isObject(value) {
    return typeof value === 'object';
}

function exist(value) {
    return value != null;
}

function log(message) {
    console.log(`------------\t ${message} \t------------`);
}

function isMapValue(map, value) {
    for (let m in map) {
        if (map.hasOwnProperty(m) && map[m] === value) {
            return true;
        }
    }
    return false;
}

function isEmpty(value) {
    if (!exist(value)) { return true; }
    if (Array.isArray(value) || isObject(value) || isString(value)) {
        for (let ele in value) {
            if (value.hasOwnProperty(ele)) {
                return false;
            } 
        }
        return true;
    } else {
        return false;
    }
}

/**
 * 数组转map
 * @param {*} array 
 * @param {*} replaceValue - 使用replaceValue代替objMap的值
 * @returns 
 */
function toObjMap(array, replaceValue) {
    let objMap = {};
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        objMap[element] = replaceValue || i;
        objMap[i] = replaceValue || element;
    }
    return objMap;
}

module.exports = {
    isString,
    isNumber,
    exist,
    isEmpty,
    log,
    isObject,
    isMapValue,
    toObjMap,
};
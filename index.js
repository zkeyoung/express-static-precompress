const util = require('./lib/util');
const compress = require('./lib/compress');
const mime = require('mime');

module.exports = precompress;

/**
 * main
 * @param {String} root - [必填]静态资源路径
 * @param {Object} option - 配置项
 * @param {Array} option.exts - [必填]要压缩的文件后缀
 * @param {Number} option.threshold - [可选]文件阈值，压缩大于等于阈值的文件
 * @param {Number} option.level - [可选]压缩等级
 * @param {Number} option.strategy - [可选]压缩策略
 * @returns 
 */
function precompress(root, option) {

    util.log('enter precompress')
    checkInput(root, option);
    dealInput(root, option);

    const filePaths = compress(root, option);
    util.log('precompress success');

    const files = dealFilePaths(filePaths, root);

    return function (req, res, next) {

        let [path, search = ''] = req.url.split('?');
        const filePath = files[path];

        if (!util.exist(filePath)) return next();
        if (!checkReqHeaders(req)) return next();

        setResponseHeaders(req, res);

        // 修改路径，以时express.static路由命中
        if (search != '') search = '?' + search;
        req.url = req.path + '.gz' + search;

        return next();
    };
}

/**
 * 输入参数检查
 * @param {*} root - 静态资源路径
 * @param {*} option - 配置项
 */
function checkInput(root, option) {
    if (!util.exist(root) || !util.isString(root)) {
        throw new TypeError('root is required and expect string');
    }

    const { exts, threshold, level, strategy } = option;
    if (!Array.isArray(exts) || util.isEmpty(exts)) {
        throw new TypeError('exts is required and expect array');
    }

    if (util.exist(threshold)) {
        if (!util.isNumber(threshold) && !util.isString(threshold)) {
            throw new TypeError('threshold expect number or string');
        }
        if (util.isString(threshold) && Number.isNaN(Number.parseFloat(threshold))) {
            throw new TypeError('threshold is illegal');
        }
    }

    if (util.exist(level) && !util.isNumber(level)) {
        throw new TypeError('level expect number');
    }

    if (util.exist(level) && !util.isNumber(strategy)) {
        throw new TypeError('strategy expect number');
    }
}

/**
 * 处理配置项数据
 * @param {*} option
 */
function dealInput(root, option) {
    if (util.isString(option.threshold)) {
        option.threshold = _fileUnitStringToNumber(option.threshold);
    }
}

function _fileUnitStringToNumber(thresholdString) {
    const thresholdUpper = thresholdString.toUpperCase();
    const char = thresholdUpper[thresholdUpper.length - 1];
    let threshold = Number.parseFloat(thresholdUpper);
    switch (char) {
        case 'K':
            threshold = threshold * Math.pow(1024, 1);
            break;
        case 'M':
            threshold = threshold * Math.pow(1024, 2);
            break;
        case 'G':
            threshold = threshold * Math.pow(1024, 3);
            break;
    }
    return threshold;
}

function checkReqHeaders(req) {
    if (req.method !== 'GET') return false;
    // 随便写的阈值，防止accept-encoding过长
    if (util.isEmpty(req.headers['accept-encoding']) || req.headers['accept-encoding'].length > 1024) return false;
    if (req.headers['accept-encoding'].indexOf('gzip') === -1) return false;
    return true;
}

function setResponseHeaders(req, res) {
    const contentType = mime.lookup(req.path);
    const charset = mime.charsets.lookup(contentType);
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Type', contentType + (charset ? `; charset=${charset}` : ''));
}

/**
 * 处理文件路径，来匹配请求path
 * @param {*} filePaths
 * @param {*} root
 * @returns 
 */
function dealFilePaths(filePaths, root) {
    let result = {};
    filePaths.forEach(filePath => {
        result[filePath.replace(root, '')] = true;
    });
    return result;
}
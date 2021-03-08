const zlib = require('zlib');
const fs = require('fs');
const util = require('./util');
const path = require('path');

/**
 * main compress
 * @param {*} root
 * @param {*} option
 * @returns
 */
function compress(root, option) {
    const filePaths = pickFiles(root, { exts: option.exts, threshold: option.threshold });
    util.log(`files count: ${filePaths.length}`);

    startCompress(filePaths, { level: option.level, strategy: option.strategy });
    return filePaths;
}

/**
 * 同步压缩
 * @param {*} filePaths
 * @param {*} option
 */
function startCompress(filePaths, option) {
    for (const filePath of filePaths) {
        const readBuffer = fs.readFileSync(filePath);
        const compressBuffer = zlib.gzipSync(readBuffer, option);
        const targetPath = filePath + '.gz';
        fs.writeFileSync(targetPath, compressBuffer);
    }
}

/**
 * 获取要压缩的文件
 * @param {*} root
 * @param {*} option
 * @returns
 */
function pickFiles(root, { exts, threshold }) {
    let result = [];

    const dirStat = fs.statSync(root);
    if (!dirStat.isDirectory()) throw new TypeError('root is not a directory');

    const extMap = util.toObjMap(exts, true);
    let dirs = [root];
    while (dirs.length) {
        const dirPath = dirs.pop();
        const fileNames = fs.readdirSync(dirPath);
        fileNames.forEach(fileName => {
            const filePath = dirPath + '/' + fileName;
            const ext = path.extname(filePath);
            // 已经压缩过的.gz文件，不用再处理。
            if (ext === '.gz') return;
            const fileStat = fs.statSync(filePath); 
            if (fileStat.isDirectory()) return dirs.push(filePath);
            if (!extMap[ext]) return;
            if (util.exist(threshold) && fileStat.size < threshold) return;
            result.push(filePath);
        });
    }
    return result;
}

module.exports = compress;
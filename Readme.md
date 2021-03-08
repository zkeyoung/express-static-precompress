## 基于[express.static](https://www.expressjs.com.cn/4x/api.html#express.static)，对静态文件提供预压缩
## 环境
* node: 10.18.0
* npm: 6.13.4
* express: 4.17.1

## 安装
```bash
$ npm install express-static-precompress
```

## 快速开始
```js
const preCompress = require('express-static-precompress');
const express = require('express');
const path = require('path');
const app = express();

// 注意：precompress需要放在express.static前
app.use(precompress(path.join(__dirname, 'public'), { exts: ['.js', '.css']} ));

app.use(express.static(path.join(__dirname, "public")));

app.listen(8080, () => {
    console.log('precompress app listening at http://localhost:8080');
});
```
## 特性
* 同步
* 预压缩（目前仅支持gzip压缩）

## 配置参数
```js
precompress(root, option);
```
* root (必填): 要压缩的静态资源目录
* option: 配置参数
* option.exts (必填): 需要压缩的文件的后缀，该参数为数组。例：exts: ['.js', '.css']
* option.threshold (选填): 文件大小阈值，对大于等于阈值的文件进行压缩。支持number(单位B)和string(单位支持K、M、G)。例如1024或'1K'。
* option.level (选填): [压缩等级](http://nodejs.cn/api/zlib.html#zlib_constants)， 例如：level: zlib.constants.Z_DEFAULT_COMPRESSION
* option.strategy (选填): [压缩策略](http://nodejs.cn/api/zlib.html#zlib_constants)，例如：strategy: zlib.constants.Z_DEFAULT_STRATEGY

## 尾言
如果对您有帮助，请给个star。^_^

## License
[MIT](LICENSE)
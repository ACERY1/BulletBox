import fs from 'fs';
import axios from 'axios';
import http from 'http';
import URL from 'url';
import path from 'path';
import FormData from 'form-data';
import { dialog } from 'electron';

const encode = 'utf-8';
const fileOpenConfig = {
  defaultPath: ''
}

/**
 * private
 * 解析URL，生成对象
 * @param {String}  URL URL字符串
 * @param {Object} opt 配置对象
 * @returns {Object} 包含hostname、port、path的opt
 */
const parseURL = (url, opt) => {
  opt = opt || {};
  url = URL.parse(url);
  var ssl = url.protocol === 'https:';
  opt.host = opt.host || opt.hostname || ((ssl || url.protocol === 'http:') ? url.hostname : 'localhost');
  opt.port = opt.port || (url.port || (ssl ? 443 : 80));
  opt.path = opt.path || (url.pathname + (url.search ? url.search : ''));
  opt.method = opt.method || 'GET';
  opt.agent = opt.agent || false;
  return opt;
}

export const read = () => {

  dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] }, paths => {
    // fs.readFile(path.resolve(__dirname, '../src/main/functions/test.txt'), encode, (err, data) => {
    // fs.readFile(paths[0], encode, (err, data) => {
    //   upload('http://localhost:7003/project/update', paths[0], data)
    // //   // return data;
    // })
    // const fileStream = fs.createReadStream(paths[0]);
    // upload('http://localhost:7003/project/update', paths[0], fileStream)

    fs.stat(paths[0], (err, stats) => {
      upload('http://localhost:7003/project/update', paths[0], 'test.js', stats.size)
    })

  })

};


/**
 * RFC Standard Upload
 * mutipart/form-data
 * TODO:支持大文件分片上传
 * @param {String} url 上传地址
 * @param {String} filePath 文件路径
 */
export const upload = (url, filePath, fileName, size, opt = {}) => {

  console.log(fileName, size)

  const endl = '\r\n';
  const boundary = '-----np' + Math.random(); // 分隔符

  let collection = [];

  // config http data
  const payLoad = 
                  '--' + boundary + endl
                + 'Content-Disposition: form-data; name="' + (opt.uploadField || "file") + '"; filename="' + fileName + '"' + endl
                + 'Content-Transfer-Encoding: binary\r\n\r\n'
                // + endl

  // collection.push(endl);
  // collection.push(content);
  // collection.push(endl);
  // collection.push('--' + boundary + '--' + endl);
  const endCode = endl + '--' + boundary + '--';


  // // config http option
  opt.method = 'POST';
  opt.headers = Object.assign({
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(payLoad) + size + Buffer.byteLength(endCode), // content-length 计算的是字节数
  }, opt.headers || {});
  opt = parseURL(url, opt);

  const req = http.request(opt, res => {
    var status = res.statusCode;
    var body = '';
    res
      .on('data', function(chunk) {
        body += chunk;
      })
      .on('end', function() {
        if (status >= 200 && status < 300 || status === 304) {
          console.log(body)
        } else {
          console.log(status)
        }
      })
      .on('error', function(err) {
        console.log(err.message || err)
      });
  })
  req.on('error', function(err) {
    console.log(err.message || err);
  });

  req.write(payLoad);

  const fileStream = fs.createReadStream(filePath,{ bufferSize: 2 * 1024 });
  
  fileStream.pipe(req, {end: false})
  
  fileStream.on('end', () => {
    req.end(endCode);
  })
  // const http = axios.create({
  //   headers: opt.headers,
  // });

  // http.post(url)
  //   .then(function (response) {
  //     // console.log(response.data.message);
  //     console.log('good news')
  //   })
  //   .catch(function (error) {
  //     console.log('bad news')
  //     console.log(error.response.data.message);
  //   });
};

/**
 * 确认上传文件
 */
export const selectFiles = () => {

};

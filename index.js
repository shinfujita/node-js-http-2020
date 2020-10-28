'use strict';
const http = require('http');
const pug = require('pug');
// const server = http.createServer((req, res) => {
const auth = require('http-auth');
const basic = auth.basic(
  { realm: 'Enquetes Area.' },
  (username, password, callback) => {
    callback(username === 'guest' && password === 'xaXZJQmE');
  });
const server = http.createServer(basic, (req, res) => {
  console.info('Requested by ' + req.connection.remoteAddress + ' desu1');

  if (req.url === '/logout') {
    res.writeHead(401, {
      'Content-Type': 'text/plain; charset=UTF-8'
    });
    res.end('ログアウトしました');
    return;
  }
  
  res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});

  console.info('受け取ったメソッドは' + req.method + 'です。')
  
  switch (req.method) {
    case 'GET':
      if (req.url === '/enquetes/yaki-shabu') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '焼き肉',
          secondItem: 'しゃぶしゃぶ'
        }));
      } else if (req.url === '/enquetes/rice-bread') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: 'ごはん',
          secondItem: 'パン'
        }));
      } else if (req.url === '/enquetes/sushi-pizza') {
        res.write(pug.renderFile('./form.pug', {
          path: req.url,
          firstItem: '寿司',
          secondItem: 'ピザ'
        }))
      }
      res.end();
      break;
    case 'POST':
      let rawData = '';
      req.on('data', (chunk) => {
        rawData = rawData + chunk;
      }).on('end', () => {
        const qs = require('querystring');
        const answer = qs.parse(rawData);
        const body = answer['name'] + 'さんは' + answer['favorite'] + 'に投票しました';
        console.info(body);
        res.write('<!DOCTYPE html><html lang="ja"><body><h1>' + body + '</h1></body></html>');
        res.end();
      });
      break;
    case 'DELETE':
      res.write('DELETE' + req.url);
      break;
    default:
      break;
  }
}).on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });

// process.envはNode.jsの環境変数を格納しているオブジェクト
// この記述で環境変数に設定されているポートの値を取得している。
// 特に設定がなければ8000番のポートを使用する
const port = process.env.PORT || 8000;
// 以下で環境変数の中身を変数 key に格納して中身を確認
let key = process.env.NODE_ENV;
console.info(key + ' desu2');

server.listen(port, () => {
  console.info('Listening on ' + port);
});
import *as express from 'express';
import *as path from 'path';
import *as bodyParser from 'body-parser';
import { Server } from 'ws';
import *as jsonwebtoken from 'jsonwebtoken';
import *as multer from 'multer';
import { User } from './models/user';
import { conn } from './connection/connection';
import *as song from './router/song';
import { SongController } from './controller/song';
import { MypageController } from './controller/mypage';
import { Song } from './models/song';
import *as AWS from 'aws-sdk';
import *as async from 'async';

let app = express();
const router = express.Router();
const jwt = jsonwebtoken;
let user: User = new User();
let tokenKey = 'mango_sujin';
var id: string;
let formId: string;
let songs: Song[] = [];
let picture: string;
let maxFileCount = 1;
let maxFileSize = 3 * 1000 * 1000;
// AWS의 해당 아이디와 비밀번호 정보는 xxxx로 표시하였습니다.
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'xxxxxxx';
AWS.config.secretAccessKey = 'xxxxxxx';

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.set('client', '../client');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(path.resolve(__dirname, '..', '../dist')));
app.use('/node_modules', express.static(path.resolve(__dirname, '..', '../node_modules')));
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/finduser', (req, res) => {
    var id = req.body.param1.toString();
    var sql = `SELECT name FROM user WHERE name ='${id}'`;
    conn.query(sql, (err, rows, fields) => {
        if(rows == '') {
            res.send('0'); //중복된 아이디가 없을 경우
        } else {
            res.send('1'); //중복된 아이디가 있을 경우
        }
    });
});

app.post('/findname', (req, res) => {
  var name = req.body.param1.toString();
  var sql = `SELECT nickname FROM user WHERE nickname ='${name}'`;
  console.log(name);
  conn.query(sql, (err, rows, fields) => {
      if(rows == '') {
          console.log(rows);
          res.send('0'); //중복된 이름이 없을 경우
      } else {
        console.log(rows);
        res.send('1'); // 중복된 이름이 있을 경우
      }
  })
});

app.post('/form', (req, res) => {
    var id = req.body.id.toString();
    var pwd = req.body.pwd.toString();
    var name = req.body.name.toString();
    var comment = req.body.comment.toString();

    formId = id;

    console.log('id:', id);
    console.log('pwd:', pwd);
    console.log('name:', name);
    console.log('comment', comment);

    var sql = `INSERT INTO user (name, password, nickname, introduce) VALUES ('${id}','${pwd}','${name}','${comment}')`;
    conn.query(sql, (err, rows, fields) => {
        console.log(rows);
    });
});

app.post('/photo', (req, res) => {
    let key = 'mypage_picture/';
    MypageController.upload(req, res, key, formId);
});


app.post('/login', (req, res) => {
    var id = req.body.id.toString();
    var pwd = req.body.pwd.toString();
    var sql = `SELECT name FROM user WHERE name='${id}' and password='${pwd}'`;
    conn.query(sql, (err, rows, fields) => {
        console.log(rows);
        if (rows == '') {
            console.log('아이디와 혹은 비밀번호가 다릅니다.');
            res.status(200).json({err: 'err'});
        } else {
            try {
                let token = jwt.sign({data: id}, tokenKey);
                res.status(200).json({token: token});
            } catch(err) {
                console.log(err);
            }
        }
    });
});

app.get('/songs', (req, res) => {
  SongController.getAllSongs((err, rows, fields) => {
    for(var i = rows.length - 1; i > -1; i-- ){
      let song : Song = new Song(parseInt(rows[i].id), rows[i].name,
                        rows[i].title, rows[i].main, rows[i].grade, rows[i].no, rows[i].picture, rows[i].song);
      songs.push(song);
    }
    res.send(songs);
    songs = [];
  });
});

app.use((req, res, next) => {
  try{
    let header = req.headers['authorization'];
    let split = header.split(' ')[1];
    if (header.length > 0 && split != null){
      let token = header.split(' ')[1];
      jwt.verify(token, tokenKey, (err, decode) => {
        if(err) {
          res.status(401).json({result: 'unauthorized'});
        } else {
          req.id = decode.data;
          next();
        }
      });
    } else {
      res.status(400).json({result: 'bad request1'});
    }
  } catch (err) {
    res.status(400).json({result: 'bad request2'});
    }
});

app.post('/updatephoto', (req, res, next) => {
  console.log('entered updatephoto');
  let key = 'mypage_picture/';
  MypageController.update(req, res, key, user.id);
});

app.use('/songs', song);

app.post('/users', (req, res) => {
    user.id = req.id;
    let sql = `SELECT id,nickname,introduce,picture FROM user WHERE name='${user.id}'`;
    conn.query(sql, (err, rows, fields) => {
      try{
        user.no = rows[0].id;
        user.name = rows[0].nickname;
        user.comment = rows[0].introduce;
        user.picture = rows[0].picture;
        res.status(200).json(user);
      } catch(err) {
        res.status(400).json({result: 'bad request'});
      }
    });
});

app.post('/comment', (req, res) => {
  let info = req.body.info.toString();
  let id = req.id
  let sql = `UPDATE \`user\` SET introduce='${info}' WHERE name='${id}'`;

  conn.query(sql, (err, rows, fields) => {
    res.send('2');
  });
});

app.use((req, res, next) => {
  try{
    let info = req.body.info.toString();
    let id = req.id;
    let sql = `SELECT nickname FROM user WHERE nickname='${info}'`;

    conn.query(sql, (err, rows, fields) => {
        console.log(rows[0]);
        if(rows[0] != undefined){
          res.send('0');
        } else {
          next();
        }
    });


  } catch (err) {
    res.status(400).json({result: 'bad request'});
  }
});

app.post('/name', (req, res) => {
  let info = req.body.info.toString();
  let id = req.id;
  let sql = `UPDATE \`user\` SET nickname='${info}' WHERE name='${id}'`;

  conn.query(sql, (err, rows, fields) => {
    res.send('1');
  });
});


const server = app.listen(80, '0.0.0.0', () => {
    const { address, port } = server.address();
    console.log(address + ':' + port);
});

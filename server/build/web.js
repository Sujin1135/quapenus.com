"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var jsonwebtoken = require("jsonwebtoken");
var user_1 = require("./models/user");
var connection_1 = require("./connection/connection");
var song = require("./router/song");
var song_1 = require("./controller/song");
var mypage_1 = require("./controller/mypage");
var song_2 = require("./models/song");
var AWS = require("aws-sdk");
var app = express();
var router = express.Router();
var jwt = jsonwebtoken;
var user = new user_1.User();
var tokenKey = 'mango_sujin';
var id;
var formId;
var songs = [];
var picture;
var maxFileCount = 1;
var maxFileSize = 3 * 1000 * 1000;
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'AKIAIFSXNDVG4Y6SKJFQ';
AWS.config.secretAccessKey = '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';
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
app.post('/finduser', function (req, res) {
    var id = req.body.param1.toString();
    var sql = "SELECT name FROM user WHERE name ='" + id + "'";
    connection_1.conn.query(sql, function (err, rows, fields) {
        if (rows == '') {
            res.send('0'); //중복된 아이디가 없을 경우
        }
        else {
            res.send('1'); //중복된 아이디가 있을 경우
        }
    });
});
app.post('/findname', function (req, res) {
    var name = req.body.param1.toString();
    var sql = "SELECT nickname FROM user WHERE nickname ='" + name + "'";
    console.log(name);
    connection_1.conn.query(sql, function (err, rows, fields) {
        if (rows == '') {
            console.log(rows);
            res.send('0'); //중복된 이름이 없을 경우
        }
        else {
            console.log(rows);
            res.send('1'); // 중복된 이름이 있을 경우
        }
    });
});
app.post('/form', function (req, res) {
    var id = req.body.id.toString();
    var pwd = req.body.pwd.toString();
    var name = req.body.name.toString();
    var comment = req.body.comment.toString();
    formId = id;
    console.log('id:', id);
    console.log('pwd:', pwd);
    console.log('name:', name);
    console.log('comment', comment);
    var sql = "INSERT INTO user (name, password, nickname, introduce) VALUES ('" + id + "','" + pwd + "','" + name + "','" + comment + "')";
    connection_1.conn.query(sql, function (err, rows, fields) {
        console.log(rows);
    });
});
app.post('/photo', function (req, res) {
    var key = 'mypage_picture/';
    mypage_1.MypageController.upload(req, res, key, formId);
});
app.post('/login', function (req, res) {
    var id = req.body.id.toString();
    var pwd = req.body.pwd.toString();
    var sql = "SELECT name FROM user WHERE name='" + id + "' and password='" + pwd + "'";
    connection_1.conn.query(sql, function (err, rows, fields) {
        console.log(rows);
        if (rows == '') {
            console.log('아이디와 혹은 비밀번호가 다릅니다.');
            res.status(200).json({ err: 'err' });
        }
        else {
            try {
                var token = jwt.sign({ data: id }, tokenKey);
                res.status(200).json({ token: token });
            }
            catch (err) {
                console.log(err);
            }
        }
    });
});
app.get('/songs', function (req, res) {
    song_1.SongController.getAllSongs(function (err, rows, fields) {
        for (var i = rows.length - 1; i > -1; i--) {
            var song_3 = new song_2.Song(parseInt(rows[i].id), rows[i].name, rows[i].title, rows[i].main, rows[i].grade, rows[i].no, rows[i].picture, rows[i].song);
            songs.push(song_3);
        }
        res.send(songs);
        songs = [];
    });
});
app.use(function (req, res, next) {
    try {
        var header = req.headers['authorization'];
        var split = header.split(' ')[1];
        if (header.length > 0 && split != null) {
            var token = header.split(' ')[1];
            jwt.verify(token, tokenKey, function (err, decode) {
                if (err) {
                    res.status(401).json({ result: 'unauthorized' });
                }
                else {
                    req.id = decode.data;
                    next();
                }
            });
        }
        else {
            res.status(400).json({ result: 'bad request1' });
        }
    }
    catch (err) {
        res.status(400).json({ result: 'bad request2' });
    }
});
app.post('/updatephoto', function (req, res, next) {
    console.log('entered updatephoto');
    var key = 'mypage_picture/';
    mypage_1.MypageController.update(req, res, key, user.id);
});
app.use('/songs', song);
app.post('/users', function (req, res) {
    user.id = req.id;
    var sql = "SELECT id,nickname,introduce,picture FROM user WHERE name='" + user.id + "'";
    connection_1.conn.query(sql, function (err, rows, fields) {
        try {
            user.no = rows[0].id;
            user.name = rows[0].nickname;
            user.comment = rows[0].introduce;
            user.picture = rows[0].picture;
            res.status(200).json(user);
        }
        catch (err) {
            res.status(400).json({ result: 'bad request' });
        }
    });
});
app.post('/comment', function (req, res) {
    var info = req.body.info.toString();
    var id = req.id;
    var sql = "UPDATE `user` SET introduce='" + info + "' WHERE name='" + id + "'";
    connection_1.conn.query(sql, function (err, rows, fields) {
        res.send('2');
    });
});
app.use(function (req, res, next) {
    try {
        var info = req.body.info.toString();
        var id_1 = req.id;
        var sql = "SELECT nickname FROM user WHERE nickname='" + info + "'";
        connection_1.conn.query(sql, function (err, rows, fields) {
            console.log(rows[0]);
            if (rows[0] != undefined) {
                res.send('0');
            }
            else {
                next();
            }
        });
    }
    catch (err) {
        res.status(400).json({ result: 'bad request' });
    }
});
app.post('/name', function (req, res) {
    var info = req.body.info.toString();
    var id = req.id;
    var sql = "UPDATE `user` SET nickname='" + info + "' WHERE name='" + id + "'";
    connection_1.conn.query(sql, function (err, rows, fields) {
        res.send('1');
    });
});
var server = app.listen(80, '0.0.0.0', function () {
    var _a = server.address(), address = _a.address, port = _a.port;
    console.log(address + ':' + port);
});

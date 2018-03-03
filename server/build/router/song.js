"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var song_1 = require("../controller/song");
var song_2 = require("../models/song");
var jsonwebtoken = require("jsonwebtoken");
var connection_1 = require("../connection/connection");
var AWS = require("aws-sdk");
var async = require("async");
var urlencode = require("urlencode");
var router = express_1.Router();
var songs = [];
var id;
var key;
var name;
var jwt = jsonwebtoken;
var tokenKey = 'mango_sujin';
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'AKIAIFSXNDVG4Y6SKJFQ';
AWS.config.secretAccessKey = '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';
router.post('/', function (req, res) {
    console.log('Join Song');
    var header = req.headers['authorization'];
    var split = header.split(' ')[1];
    if (header.length > 0 && split != null) {
        var token = header.split(' ')[1];
        jwt.verify(token, tokenKey, function (err, decode) {
            if (err) {
                res.status(401).json({ result: 'unauthorized' });
            }
            else {
                _this.key = decode.data;
            }
        });
        var sql = "SELECT nickname FROM user WHERE name='" + _this.key + "'";
        connection_1.conn.query(sql, function (err, rows, fields) {
            try {
                _this.name = rows[0].nickname;
                song_1.SongController.addSong(_this.name, req.body.title.toString(), req.body.comment.toString(), parseInt(req.body.no.toString()), '', function (err, rows, fields) {
                    if (err) {
                        res.json({ err: err });
                    }
                    else {
                        res.json({ id: rows.insertId });
                    }
                });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
});
router.post('/cover', function (req, res) {
    var type = 'picture';
    var key = 'song_picture/';
    song_1.SongController.upload(req, res, type, key);
});
router.post('/mysong', function (req, res) {
    var type = 'song';
    var key = 'song_song/';
    song_1.SongController.upload(req, res, type, key);
});
router.post('/addPhoto', function (req, res) {
    console.log('req.body.location.toString() : ' + req.body.location.toString());
    console.log('req.body.id.toString() : ' + req.body.id.toString());
    song_1.SongController.idSong('picture', req.body.location.toString(), req.body.id.toString(), function (err, rows, fields) {
        console.log('idSong');
        if (err) {
            console.log(err);
            res.json({ err: err });
        }
        else {
            res.send({ success: 'success' });
        }
    });
});
router.post('/addSong', function (req, res) {
    song_1.SongController.idSong('song', req.body.location.toString(), req.body.id.toString(), function (err, rows, fields) {
        if (err) {
            res.json({ err: err });
        }
        else {
            res.json({ success: 'success' });
        }
    });
});
router.post('/file', function (req, res) {
    console.log('req.body.file : ' + req.body.file);
    var file = req.body.path +
        urlencode.decode(req.body.file).split('/')[req.body.file.split('/').length - 1];
    async.waterfall([
        function (callback) {
            console.log('first');
            song_1.SongController.delete_file(req, file);
            callback(null);
        }
    ], function (err, result) {
        console.log('result');
        if (err) {
            res.json({ err: err });
        }
        else {
            res.send('1');
        }
    });
});
router.put('/:id', function (req, res) {
    var id = req.params.id;
    var no = req.params.no;
    var song = new song_2.Song(id, req.body.title.toString(), '', req.body.comment.toString(), 0, no, '', '');
    song_1.SongController.updateSong(song, function (err, rows, fields) {
        console.log('success');
    });
    console.log('id : ' + id);
    res.send('success');
});
router.post('/:id', function (req, res) {
    _this.id = req.params.id;
    song_1.SongController.getSongById(_this.id, function (err, rows, fields) {
        var song = new song_2.Song(parseInt(rows[0].id), rows[0].name, rows[0].title, rows[0].main, rows[0].grade, rows[0].no, rows[0].picture, urlencode.decode(rows[0].song));
        res.send(song);
    });
});
router.delete('/:id', function (req, res) {
    var id = req.params.id;
    console.log('id : ' + id);
    async.waterfall([
        function (callback) {
            var picture;
            var song;
            song_1.SongController.getSongById(id, function (err, rows, fields) {
                console.log(err);
                if (rows[0].song) {
                    song = rows[0].song;
                }
                if (rows[0].picture != '') {
                    picture = 'song_picture/' + urlencode.decode(rows[0].picture).split('/')[rows[0].picture.split('/').length - 1];
                    song_1.SongController.deleteSong(id, function (err, rows, fields) {
                        song_1.SongController.delete(req, picture);
                        console.log('picture : ' + picture);
                        callback(null, song);
                    });
                }
                else {
                    song_1.SongController.deleteSong(id, function (err, rows, fields) {
                        if (err)
                            console.log(err);
                        callback(null, song);
                    });
                }
            });
        }, function (arg1, callback) {
            var song;
            if (arg1 != null) {
                song = 'song_song/' + urlencode.decode(arg1).split('/')[arg1.split('/').length - 1];
                song_1.SongController.delete(req, song);
                console.log('song : ' + song);
                callback(null);
            }
            else {
                callback(null);
            }
        }
    ], function (err, result) {
        if (err) {
            res.json({ err: err });
        }
        else {
            res.send('1');
        }
    });
});
module.exports = router;

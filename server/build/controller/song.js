"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var connection_1 = require("../connection/connection");
var formidable = require("formidable");
var AWS = require("aws-sdk");
exports.SongController = {
    getAllSongs: function (callback) {
        return connection_1.conn.query("Select * FROM song", callback);
    },
    getSongById: function (id, callback) {
        return connection_1.conn.query("select * from song where id=?", [id], callback);
    },
    addSong: function (name, title, comment, no, picture, callback) {
        return connection_1.conn.query("Insert into song(name, title, main, no, picture) values(?,?,?,?,?)", [name, title, comment, no, picture], callback);
    },
    deleteSong: function (id, callback) {
        return connection_1.conn.query("delete from song where id=?", [id], callback);
    },
    updateSong: function (song, callback) {
        return connection_1.conn.query("update song set title=?,main=? WHERE id=?", [song.title, song.main, song.id], callback);
    },
    idSong: function (column, path, coverId, callback) {
        return connection_1.conn.query("UPDATE song SET " + column + " = ? WHERE id = ?", [path, coverId], callback);
    },
    upload: function (req, res, type, key) {
        var form = new formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: false //확장자 제거
        });
        form.parse(req, function (err, fields, files) {
            var s3 = new AWS.S3();
            var params = {
                Bucket: 'quapenus',
                Key: key + Date.now() + '-' + files.file.name,
                ACL: 'public-read',
                Body: require('fs').createReadStream(files.file.path)
            };
            s3.upload(params, function (err, data) {
                if (!err) {
                    res.json({ success: data.Location });
                }
                else {
                    res.json({ err: err });
                }
            });
        });
    },
    delete: function (req, picture) {
        var form = formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: false
        });
        form.parse(req, function (err, fields, files) {
            var s3 = new AWS.S3();
            var deleteParam = {
                Bucket: 'quapenus',
                Key: picture
            };
            s3.deleteObject(deleteParam, function (err, data) {
            });
        });
    },
    delete_file: function (req, file) {
        var form = formidable.IncomingForm({
            encoding: 'utf-8',
            keepExtensions: false
        });
        form.parse(req, function (err, fields, files) {
            var s3 = new AWS.S3();
            var deleteParam = {
                Bucket: 'quapenus',
                Key: file
            };
            s3.deleteObject(deleteParam, function (err, data) {
            });
        });
    }
};

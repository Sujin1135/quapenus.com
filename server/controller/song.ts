import *as mysql from 'mysql';
import { conn } from '../connection/connection';
import { Song } from '../models/song';
import *as formidable from 'formidable';
import *as AWS from 'aws-sdk';
import *as urlencode from 'urlencode';

export var SongController={

getAllSongs:function(callback){
return conn.query("Select * FROM song",callback);
},
 getSongById:function(id,callback){
return conn.query("select * from song where id=?",[id],callback);
 },
 addSong:function(name:string, title:string, comment:string, no:number, picture:string, callback){
 return conn.query("Insert into song(name, title, main, no, picture) values(?,?,?,?,?)",[name, title, comment, no, picture], callback);
 },
 deleteSong:function(id,callback){
  return conn.query("delete from song where id=?",[id],callback);
 },
 updateSong:function(song : Song,callback){
  return conn.query("update song set title=?,main=? WHERE id=?",[song.title, song.main, song.id],callback);
 },
 idSong:function(column:string, path:string, coverId:number, callback){
  return conn.query(`UPDATE song SET ${column} = ? WHERE id = ?`, [path, coverId], callback);
 },
 upload(req, res, type:string, key:string){
    var form = new formidable.IncomingForm({
    encoding: 'utf-8',
    keepExtensions: false //확장자 제거
    });
   form.parse(req, function(err, fields, files){
    var s3 = new AWS.S3();
    var params = {
        Bucket:'quapenus',
        Key: key + Date.now() + '-' +files.file.name,
        ACL:'public-read',
        Body: require('fs').createReadStream(files.file.path)
       }    
    s3.upload(params, function(err, data){
        if(!err){
            res.json({success: data.Location});
        } else {
            res.json({err: err});
        }
    });
});
},
 delete(req, picture){
     let form = formidable.IncomingForm({
        encoding: 'utf-8',
        keepExtensions: false
     })
     form.parse(req, function(err, fields, files){
        var s3 = new AWS.S3();
        
        var deleteParam = {
            Bucket:'quapenus',
            Key: picture
        }
        s3.deleteObject(deleteParam, (err, data) => {
        });
     });
 },
 delete_file(req, file){
    let form = formidable.IncomingForm({
       encoding: 'utf-8',
       keepExtensions: false
    })
    form.parse(req, function(err, fields, files){
       var s3 = new AWS.S3();
       
       var deleteParam = {
           Bucket:'quapenus',
           Key: file
       }
       s3.deleteObject(deleteParam, (err, data) => {
       });
    });
}
}

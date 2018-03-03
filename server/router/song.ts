import { Router } from 'express';
import { SongController } from '../controller/song';
import { Song } from '../models/song';
import *as jsonwebtoken from 'jsonwebtoken'
import { conn } from '../connection/connection';
import *as formidable from 'formidable';
import *as AWS from 'aws-sdk';
import *as async from 'async';
import *as urlencode from 'urlencode';

let router = Router();
let songs : Song[] = [];
let id : number;
let key : string;
let name : string;
const jwt = jsonwebtoken;
let tokenKey = 'xxxxx';
AWS.config.region = 'ap-northeast-2';
AWS.config.accessKeyId = 'xxxxx';
AWS.config.secretAccessKey = 'xxxxx';

router.post('/', (req, res) => {
  console.log('Join Song');
  let header = req.headers['authorization'];
  let split = header.split(' ')[1];
  if (header.length > 0 && split != null){
    let token = header.split(' ')[1];
    jwt.verify(token, tokenKey, (err, decode) => {
      if(err) {
        res.status(401).json({result: 'unauthorized'});
      } else {
        this.key = decode.data;
      }
  });

  let sql = `SELECT nickname FROM user WHERE name='${this.key}'`;
  conn.query(sql, (err, rows, fields) => {
      try{
      this.name = rows[0].nickname;
       SongController.addSong(this.name, req.body.title.toString(),
            req.body.comment.toString(), parseInt(req.body.no.toString()), '', (err, rows, fields) => {
              if(err) {
                res.json({err: err});
              } else {
                res.json({id: rows.insertId});
              }
            });
      } catch(err) {
        console.log(err);
      }
    });
  }
});

router.post('/cover', (req, res) => {
  let type = 'picture';
  let key = 'song_picture/';
  SongController.upload(req, res, type, key);
});

router.post('/mysong', (req, res) => {
  let type = 'song';
  let key = 'song_song/'
  SongController.upload(req, res, type, key);
});

router.post('/addPhoto', (req, res) => {
  console.log('req.body.location.toString() : ' + req.body.location.toString());
  console.log('req.body.id.toString() : ' + req.body.id.toString());
  SongController.idSong('picture', req.body.location.toString(), req.body.id.toString(),
   (err, rows, fields) => {
     console.log('idSong');
      if(err){
        console.log(err);
        res.json({err: err});
      } else {
        res.send({success: 'success'});
      }
   });
});

router.post('/addSong', (req, res) => {
  SongController.idSong('song', req.body.location.toString(), req.body.id.toString(),
   (err, rows, fields) => {
      if(err){
        res.json({err: err});
      } else {
        res.json({success: 'success'});
      }
   });
});

router.post('/file', (req, res) => {
  console.log('req.body.file : '+ req.body.file);
  let file = req.body.path + 
    urlencode.decode(req.body.file).split('/')[req.body.file.split('/').length-1];
    async.waterfall([
      (callback) => {
        console.log('first');
        SongController.delete_file(req, file);
        callback(null);
      }],  (err, result) => {
        console.log('result');
        if(err){
          res.json({err : err});
        } else {
          res.send('1');
        }
      });
});

router.put('/:id', (req, res) => {
    let id = req.params.id;
    let no = req.params.no;
    let song : Song = new Song(id, req.body.title.toString(), '',
                                req.body.comment.toString(), 0,no, '','');

    SongController.updateSong(song, (err, rows, fields) => {
      console.log('success');
    });
    console.log('id : '+ id);
    res.send('success');
});

router.post('/:id', (req, res) => {
  this.id = req.params.id;
  SongController.getSongById(this.id, (err, rows, fields) => {
    let song : Song = new Song(parseInt(rows[0].id), rows[0].name,
                        rows[0].title, rows[0].main, rows[0].grade,
                         rows[0].no, rows[0].picture,
                        urlencode.decode(rows[0].song));
    res.send(song);
  });
});

router.delete('/:id', (req, res) => {
  let id = req.params.id;
  console.log('id : '+ id);
  async.waterfall([
    (callback) => {
      let picture;
      let song;
      SongController.getSongById(id, (err, rows, fields) => {
        console.log(err);
        if(rows[0].song){
          song = rows[0].song;
        }
        if(rows[0].picture != ''){
          picture = 'song_picture/'+urlencode.decode(rows[0].picture).split('/')[rows[0].picture.split('/').length-1];
          SongController.deleteSong(id, (err, rows, fields) => {
            SongController.delete(req, picture);
            console.log('picture : '+picture);
            callback(null, song);
          });
        } else {
          SongController.deleteSong(id, (err, rows, fields) => {
            if(err) console.log(err);
            callback(null, song);
          });
        }
      });
    }, (arg1, callback) => {
      let song;
        if(arg1 != null){
          song = 'song_song/'+urlencode.decode(arg1).split('/')[arg1.split('/').length-1];
          SongController.delete(req, song);
          console.log('song : '+song);
          callback(null);
        } else {
          callback(null);
        }
    }
  ],  (err, result) => {
      if(err){
        res.json({err : err});
      } else {
        res.send('1');
      }
    });
});

module.exports = router;

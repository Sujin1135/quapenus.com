import *as mysql from 'mysql';
import { conn } from '../connection/connection';
import *as formidable from 'formidable';
import *as AWS from 'aws-sdk';
import *as urlencode from 'urlencode';

export let MypageController = {
    upload(req, res, key:string, formId: string){
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
            if(err){
                console.log(err);
                res.json({err: err});
            } else {
                let sql = `UPDATE user SET picture = '${data.Location}' WHERE name = '${formId}'`;
                    conn.query(sql, (err, rows, fields) => {
                        console.log(rows.affectedRows);
                    });
                    if(!err){
                        res.json({success: 'success upload'});
                    }
                }
            });
        });
    },
    update(req, res, key:string, formId: string) {
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
        var deleteParam = {
            Bucket:'quapenus',
            Key:''
        }
        conn.query(`SELECT picture FROM user WHERE name = '${formId}'`,
        (err, rows, fields) => {
            deleteParam.Key = urlencode.decode('mypage_picture/'+rows[0].picture.split('/')[rows[0].picture.split('/').length-1]);
            if(err) res.json({err: err});
        });
        s3.upload(params, function(err, data){
            if(err){
                res.json({err: err});
            } else {
                    s3.deleteObject(deleteParam, (err, data) => {
                        if(err) res.json({err: err});
                        if(data) res.json({success: 'success upload'});
                    });
                let sql = `UPDATE user SET picture = '${data.Location}' WHERE name = '${formId}'`;
                conn.query(sql, (err, rows, fields) => {
                    if(err) res.json({err: err});
                    console.log(rows.affectedRows);
                });
                }
            });
        });
    }
}

/*
let sql = `UPDATE user SET picture = '${data.Location}' WHERE name = '${formId}'`;
                    conn.query(sql, (err, rows, fields) => {
                        console.log(rows);
                    });
*/
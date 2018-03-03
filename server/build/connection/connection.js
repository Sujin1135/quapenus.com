"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require("mysql");
exports.conn = mysql.createConnection({
    host: 'quapenus.cpxh8rzgydhx.ap-northeast-2.rds.amazonaws.com',
    port: 3306,
    user: 'mango',
    password: 'tnwls1135',
    database: 'quapenus_users'
});
// quapenus.cpxh8rzgydhx.ap-northeast-2.rds.amazonaws.com 

import *as mysql from 'mysql';

export var conn = mysql.createConnection({
    // 데이터 베이스 정보는 xxxx로 표시하였습니다.
    host: 'xxxxx',
    port: 3306,
    user: 'xxxxx',
    password: 'xxxxx',
    database: 'quapenus_users'
});

// quapenus.cpxh8rzgydhx.ap-northeast-2.rds.amazonaws.com

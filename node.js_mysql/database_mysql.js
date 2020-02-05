let mysql = require('mysql');
let connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'o2'
});
connection.connect();
/*
let sql = 'select * from topic';
connection.query(sql,(err,rows,fields)=>{
    if(err){
        console.log(err);
    }else{
        for(let i=0; i<rows.length;i++){
            console.log(rows[i].title);
        }
    }
});
*/
let sql = 'insert into topic (title,description,author) values(?,?,?)';
let params=['Supervisor','Watcher','graphittie'];
connection.query(sql,params,(err,rows,fields)=>{
    if(err){
        console.log(err);
    }else{
        console.log(rows.insertId);
    }
});
connection.end();
/*오류 발생
Client does not support authentication protocol requested by server; consider upgrading MySQL client

해결 방법 : 
mysql 접속 후
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';
FLUSH PRIVILEGES;
*/
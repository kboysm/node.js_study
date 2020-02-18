let express= require('express');
let http = require('http');
let static = require('serve-static');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
//에러 핸들러
let expressErrorHandler= require('express-error-handler');
let mysql = require('mysql');
let pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'1234',
    database:'test',
    debug:false
});
let app = express();
app.set('port',process.env.PORT || 1234);
app.use('/public',static(path.join(__dirname,'public')));

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true,
}));

let router = express.Router();
router.route('/process/adduser').post((req,res)=>{
    console.log('/process/adduser 라우팅 함수 호출');
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    let paramName = req.body.name || req.query.name;
    let paramAge = req.body.age || req.query.age;

    console.log('요청 파라미터'+paramId+" , "+paramName+" , "+paramPassword+" , "+paramAge);
    addUser(paramId,paramName,paramAge,paramPassword,(err,addedUser)=>{
        if(err){
            console.log('에러발생');
            res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
            res.write('<h1>err발생</h1>');
            res.end();
            return;
        }
        if(addedUser){
            console.dir(addedUser);
            res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.end();
        }else{
            console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 실패</h1>');
                res.end();
        }
    });
});
router.route('/process/login').post((req,res)=>{
    console.log('/process/login 라우팅 함수 호출')
    let paramId = req.body.id || req.query.id;
    let paramPassword = req.body.password || req.query.password;
    console.log('요청 파라미터 : '+paramId + ', '+ paramPassword);

        authUser(paramId,paramPassword,(err,rows)=>{
            if(err){
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>err발생</h1>');
                res.end();
                return;
            }
            if(rows){
                console.dir(rows);
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>login  성공</h1>');
                res.write('<div><p>사용자 : '+rows[0].name+'</p></div>');
                res.write('<br><br><a href="/public/login.html">다시 로그인하기</a>');
                res.end();
                
            }else{
                console.log('에러발생');
                res.writeHead(200,{"Content-Type":"text/html;charset=utf8"});
                res.write('<h1>사용자 데이터가 조회 안됨</h1>');
                res.end();
                
            }
        });
   
});
app.use('/',router);
let addUser= function(id,name,age,password,callback){
    console.log('add user 호출');

    pool.getConnection(function(err,conn){
        if(err){
            if(conn){conn.release();}
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결된 스레드 아이디 : '+conn.threadId);
        let data = {id:id,name:name,password:password};
        let exec=conn.query('insert into users set ?',data,function(err,result){
            conn.release();
            console.log('실행된 sql : '+exec.sql);
            if(err){
                console.log('sql 실행 에러');
                callback(err,null);
                return;
            }
            callback(null,result);
        });
    });

}
let authUser = function(id,password,callback){
    console.log('authUser 호출 : '+id+","+password);
    pool.getConnection((err,conn)=>{
        if(err){
           if(conn){ conn.release();}
           callback(err,null);
           return;
        }
        console.log('데이터베이스 연결된 스레드 아이디 : '+conn.threadId);
        let tablename="users";
        let columns = ['id','name','age'];
        let exec = conn.query("select ?? from ?? where id= ? and password=?",
        [columns,tablename,id,password],(err,rows)=>{
            conn.release();
            console.log("실행된 sql : "+exec.sql);
            if(err){
                callback(err,null);
                return;
             }
             if(rows.length>0){
                 console.log('사용자 찾음');
                 callback(null,rows);
             }else{
                 console.log('사용자 찾지 못함.');
                 callback(null,null);
             }
        });
    })
};

let errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);

let server = http.createServer(app).listen(app.get('port'),()=>{
    console.log(app.get('port')+"번 포트로 접속 완료!");
    //db연결
});